import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/provider/AppProvider";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import { Client } from "@stomp/stompjs";
import Peer from "simple-peer";
import { usePathname } from "next/navigation";
import axios from "axios";

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {

    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receiver, setReceiver] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [toggleCamera, setToggleCamera] = useState(false);
    const [toggleMicrophone, setToggleMicrophone] = useState(true);
    const [isOffCamera, setIsOffCamera] = useState(false);
    const [isOffMicrophone, setIsOffMicrophone] = useState(true);
    const [callStartTime, setCallStartTime] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [nameReceiver, setNameReceiver] = useState("");
    const myScreen = useRef(null);
    const receiverScreen = useRef(null);
    const isOnCameraRef = useRef(null);
    const isOnMicRef = useRef(null);
    const connectionRef = useRef(null);
    const stompClientRef = useRef(null);
    const btnRef = useRef(null);

    const { user } = useApp();
    const path = usePathname();

    useEffect(() => {

        if (user) {
            setMe(user.id);
            setName(`${user.firstName} ${user.lastName}`);
            if (path === '/video-call') {
                getLocalStream();
            }
            const sockJS = new SockJS(
                `${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`
            );
            const client = new Client({
                webSocketFactory: () => sockJS,
                debug: (str) => console.log(str),
                reconnectDelay: 5000,
            });

            client.onConnect = (frame) => {
                console.log("Connected: " + frame);
                client.subscribe(`/user/${user.id}/topic/call`, (message) => {
                    const data = JSON.parse(message.body);
                    if (data.type === "callUser") {
                        setCallEnded(false);
                        setReceiver(true);
                        setCaller(data.from);
                        setName(data.name);
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.from}`, {
                            headers: {
                                Authorization: `Bearer ${Cookies.get('token')}`,
                            }
                        })
                            .then((response) => {
                                const user = response.data;
                                setNameReceiver(`${user.firstName} ${user.lastName}`);
                            })
                            .catch((error) => {
                                console.error('Error fetching user info:', error);
                            });
                        setCallerSignal(data.signalData);
                    } else if (data.type === "callAccepted") {
                        setCallEnded(false);
                        setCallAccepted(true);
                        setCallStartTime(Date.now());
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.from}`, {
                            headers: {
                                Authorization: `Bearer ${Cookies.get('token')}`,
                            }
                        })
                            .then((response) => {
                                const user = response.data;
                                setNameReceiver(`${user.firstName} ${user.lastName}`);
                            })
                            .catch((error) => {
                                console.error('Error fetching user info:', error);
                            });
                        if (connectionRef.current) {
                            connectionRef.current.signal(data.signalData);
                        }
                    } else if (data.type === "offCamera") {
                        isOnCameraRef.current = false;
                        console.log("offCamera");
                        setIsOffCamera(true);
                    } else if (data.type === "onCamera") {
                        isOnCameraRef.current = true;
                        setIsOffCamera(false);
                    } else if (data.type === "offMic") {
                        isOnMicRef.current = false;
                        setIsOffMicrophone(true);
                    } else if (data.type === "onMic") {
                        isOnCameraRef.current = true;
                        setIsOffMicrophone(false);
                    } else if (data.type === 'endCall') {
                        if (btnRef.current) {
                            btnRef.current.click();
                        } else {
                            leaveCall();
                        }
                    }
                });
            };

            client.onStompError = (frame) => {
                console.error(`Broker reported error ${frame.headers}`);
                console.error(`Additional details ${frame.body}`);
            };


            client.activate();
            stompClientRef.current = client;

            return () => {
                client.deactivate();
            };
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (callStartTime && callAccepted && !callEnded) {
            interval = setInterval(() => {
                const now = Date.now();
                const duration = Math.floor((now - callStartTime) / 1000);
                setCallDuration(duration);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callStartTime, callAccepted, callEnded]);


    const getLocalStream = () => {

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((localStream) => {
                localStream.getVideoTracks()[0].enabled = toggleCamera;
                setStream(localStream);
                if (myScreen.current) {
                    myScreen.current.srcObject = localStream;
                }
            })
            .catch((error) => console.error("Media error:", error));
    }



    const callUser = (id) => {


        if (stompClientRef.current) {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream,
            });

            peer.on("signal", (data) => {
                stompClientRef.current.publish({
                    destination: "/app/call",
                    body: JSON.stringify({
                        userToCall: id,
                        signalData: data,
                        from: me,
                        name: name,
                    }),
                });
            });

            peer.on("stream", (remoteStream) => {
                if (receiverScreen.current) {
                    if (isOnCameraRef.current) {
                        setIsOffMicrophone(remoteStream.getAudioTracks()[0].enabled);
                        remoteStream.getVideoTracks()[0].enabled = isOnCameraRef.current;
                    }
                    receiverScreen.current.srcObject = remoteStream;
                }
            });

            connectionRef.current = peer;
        }
    };

    const answerCall = () => {


        if (stompClientRef.current) {
            setCallAccepted(true);
            setCallStartTime(Date.now());

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
            });

            peer.on("signal", (data) => {
                stompClientRef.current.publish({
                    destination: "/app/answer",
                    body: JSON.stringify({
                        to: caller,
                        signalData: data,
                        from: me,
                    }),
                });
            });

            peer.on("stream", (remoteStream) => {
                if (receiverScreen.current) {
                    if (isOnCameraRef.current) {
                        setIsOffMicrophone(remoteStream.getAudioTracks()[0].enabled);
                        remoteStream.getVideoTracks()[0].enabled = isOnCameraRef.current;
                    }
                    receiverScreen.current.srcObject = remoteStream;
                }
            });

            peer.signal(callerSignal);
            connectionRef.current = peer;
        }
    };


    const disconnection = () => {
        setCallEnded(true);
        setCaller(null);
        setCallerSignal(null);
        setReceiver(false);
        setCallAccepted(false);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
    };

    const leaveCall = () => {
        stompClientRef.current.publish({
            destination: "/app/toggle",
            body: JSON.stringify({
                type: "endCall",
                from: me,
                userToCall: caller ? caller : idToCall,
                to: caller ? caller : idToCall
            }),
        });
        disconnection();
        getLocalStream();
    };

    const toggleVideo = async () => {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            stompClientRef.current.publish({
                destination: "/app/toggle",
                body: JSON.stringify({
                    type: videoTrack.enabled ? "onCamera" : "offCamera",
                    from: me,
                    userToCall: caller ? caller : idToCall,
                    to: caller ? caller : idToCall
                }),
            });
            videoTrack.enabled = !videoTrack.enabled;
            setToggleCamera(videoTrack.enabled);
        }
    };

    const toggleAudio = async () => {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            stompClientRef.current.publish({
                destination: "/app/toggle",
                body: JSON.stringify({
                    type: audioTrack.enabled ? "onMic" : "offMic",
                    from: me,
                    userToCall: caller ? caller : idToCall,
                    to: caller ? caller : idToCall
                }),
            })
            audioTrack.enabled = !audioTrack.enabled;
            setToggleMicrophone(audioTrack.enabled);
        }
    };

    return (
        <CallContext.Provider value={{
            me,
            stream,
            receiver,
            caller,
            callerSignal,
            callAccepted,
            idToCall,
            setIdToCall,
            callEnded,
            btnRef,
            name,
            setName,
            toggleCamera,
            toggleMicrophone,
            isOffCamera,
            isOffMicrophone,
            callUser,
            answerCall,
            leaveCall,
            toggleVideo,
            toggleAudio,
            myScreen,
            receiverScreen,
            callDuration,
            nameReceiver,
            stompClientRef,
            connectionRef,
        }}>
            {children}
        </CallContext.Provider>
    )

}

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCall must be used within an CallProvider")
    }
    return context;
}

