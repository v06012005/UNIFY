"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/provider/AppProvider";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import Peer from "simple-peer";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";

const Page = () => {
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
    const [isOffMicrophone, setIsOffMicrophone] = useState(false);
    const myScreen = useRef(null);
    const receiverScreen = useRef(null);
    const connectionRef = useRef(null);
    const stompClientRef = useRef(null);

    const { user } = useApp();

    useEffect(() => {
        if (user) {
            setMe(user.id);

            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((localStream) => {
                    setStream(localStream);
                    if (myScreen.current) {
                        myScreen.current.srcObject = localStream;
                    }
                })
                .catch((error) => console.error("Media error:", error));

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
                        setReceiver(true);
                        setCaller(data.from);
                        setName(data.name);
                        setCallerSignal(data.signalData);
                    } else if (data.type === "callAccepted") {
                        setCallAccepted(true);
                        if (connectionRef.current) {
                            connectionRef.current.signal(data.signalData);
                        }
                    } else if (data.type === "offCamera") {
                        setIsOffCamera(true);
                    } else if (data.type === "onCamera") {
                        console.log('On Camera !');
                        setIsOffCamera(false);
                        if (connectionRef.current && connectionRef.current._pc) {
                            const remoteStream = new MediaStream(
                                connectionRef.current._pc.getReceivers().map(r => r.track).filter(Boolean)
                            );
                            console.log("Rebuilt remote stream", remoteStream);
                            if (receiverScreen.current) {
                                receiverScreen.current.srcObject = remoteStream;
                            }
                        }
                    } else if (data.type === "offMic") {
                        setIsOffMicrophone(true);
                    } else if (data.type === "onMic") {
                        setIsOffMicrophone(false);
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
        if (stream && myScreen.current) {
            myScreen.current.srcObject = stream;
        }
    }, [stream, toggleMicrophone, toggleCamera]);

    const callUser = (id) => {

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
                receiverScreen.current.srcObject = remoteStream;
            }
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
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
                receiverScreen.current.srcObject = remoteStream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
    };

    const toggleVideo = async () => {
        if (stream && stompClientRef.current) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack && videoTrack.readyState === "live") {
                    stompClientRef.current.publish({
                        destination: "/app/toggle",
                        body: JSON.stringify({
                            type: "offCamera",
                            from: me,
                            name: name,
                            userToCall: caller ? caller : idToCall,
                            to: caller ? caller : idToCall,
                        }),
                    });
                videoTrack.stop();
                stream.removeTrack(videoTrack);
                setToggleCamera(false);
            } else {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                const newVideoTrack = newStream.getVideoTracks()[0];
                stream.addTrack(newVideoTrack);
                setToggleCamera(true);
                   stompClientRef.current.publish({
                       destination: "/app/toggle",
                       body: JSON.stringify({
                           type: "onCamera",
                           from: me,
                           name: name,
                           userToCall: caller ? caller : idToCall,
                           to: caller ? caller : idToCall,
                       }),
                   });
                if (connectionRef.current && connectionRef.current._pc) {
                    const sender = connectionRef.current._pc
                        .getSenders()
                        .find((s) => s.track && s.track.kind === "video");
                    if (sender) {
                        await sender.replaceTrack(newVideoTrack);
                        console.log("Video track replaced on PeerConnection");
                    }
                }
            }
        }
    };

    const toggleAudio = async () => {
        if (stream && stompClientRef.current) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack && audioTrack.readyState === "live") {
                stompClientRef.current.publish({
                    destination: "/app/toggle",
                    body: JSON.stringify({
                        type: "offMic",
                        from: me,
                        name: name,
                        userToCall: caller,
                        to: caller,
                    }),
                });
                audioTrack.stop();
                stream.removeTrack(audioTrack);
                setToggleMicrophone(false);
            } else {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const newAudioTrack = newStream.getAudioTracks()[0];
                stream.addTrack(newAudioTrack);
                setToggleMicrophone(true);
                stompClientRef.current.publish({
                    destination: "/app/toggle",
                    body: JSON.stringify({
                        type: "onMic",
                        from: me,
                        name: name,
                        userToCall: caller,
                        to: caller,
                    }),
                });
            }
        }
    };

    return (
        <div className="w-full h-screen relative">

            <div className="w-full h-full flex justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-50">
                {callAccepted && !callEnded && !isOffCamera ? (
                    <video ref={receiverScreen} autoPlay className="w-20" />
                ) : (
                    isOffCamera && (
                        <div className="w-80 h-40">
                            <h3 className="text-white">{name}</h3>
                        </div>
                    )
                )}
            </div>

            <div className="w-full flex items-center justify-center gap-5 bottom-0 absolute mb-10 z-50">
                <div style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: "0.5rem", marginRight: "1rem" }}
                        className="text-black"
                    />
                    <input
                        type="text"
                        placeholder="ID to call"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                        style={{ padding: "0.5rem", marginRight: "1rem" }}
                        className="text-black"
                    />
                    {callAccepted && !callEnded ? (
                        <button onClick={leaveCall} style={{ padding: "0.5rem" }}>
                            End Call
                        </button>
                    ) : (
                        <button onClick={() => callUser(idToCall)} style={{ padding: "0.5rem" }}>
                            Call
                        </button>
                    )}
                </div>
                {receiver && !callAccepted && (
                    <div style={{ marginTop: "1rem" }}>
                        <p>{name} is calling...</p>
                        <button onClick={answerCall} style={{ padding: "0.5rem" }}>
                            Answer
                        </button>
                    </div>
                )}
                <button
                    onClick={toggleAudio}
                    className="flex items-center gap-2 px-5 py-5 bg-transparent border-2 border-solid border-gray-300 rounded-full"
                >
                    {!toggleMicrophone ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                    onClick={toggleVideo}
                    className="flex items-center gap-2 px-5 py-5 bg-transparent border-2 border-solid border-gray-300 rounded-full"
                >
                    {!toggleCamera ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
                <button
                    className="flex items-center gap-2 px-5 py-5 bg-red-500 hover:bg-red-600 text-white border-2 border-transparent transition-colors rounded-full"
                >
                    <Phone className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute bottom-0 right-0">
                <video
                    ref={myScreen}
                    autoPlay
                    playsInline
                    className="w-48 h-36 rounded-2xl m-3"
                />
            </div>
        </div>
    );
};

export default Page;
