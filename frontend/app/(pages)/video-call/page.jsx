'use client'

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/provider/AppProvider";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import Peer from "simple-peer";
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";

const Page = () => {
    // Local state variables
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receiver, setReceiver] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    // Toggle states for camera and mic
    const [toggleCamera, setToggleCamera] = useState(false); // initially off
    const [toggleMicrophone, setToggleMicrophone] = useState(true); // initially on

    // Refs for video elements, stream, connection, and stomp client
    const myScreen = useRef(null);
    const receiverScreen = useRef(null);
    const streamRef = useRef(null);
    const connectionRef = useRef(null);
    const stompClientRef = useRef(null);

    const { user } = useApp();

    useEffect(() => {
        if (user) {
            setMe(user.id);

            navigator.mediaDevices
                .getUserMedia({ video: toggleCamera, audio: toggleMicrophone })
                .then((localStream) => {
                    setStream(localStream);
                    streamRef.current = localStream;
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
    }, [user, toggleCamera, toggleMicrophone]);

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

    const stopTrack = (type) => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                if (track.kind === type) {
                    track.stop();
                }
            });
        }
    };

    const toggleVideo = async () => {
        if (!toggleCamera) {
            try {

                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const newVideoTrack = videoStream.getVideoTracks()[0];

                if (streamRef.current) {
                    const existingVideoTracks = streamRef.current.getVideoTracks();
                    if (existingVideoTracks.length > 0 && connectionRef.current) {
                        connectionRef.current.replaceTrack(existingVideoTracks[0], newVideoTrack, streamRef.current);
                    } else {
                        streamRef.current.addTrack(newVideoTrack);
                    }
                    setStream(streamRef.current);
                } else {
                    streamRef.current = videoStream;
                    setStream(videoStream);
                }
                if (myScreen.current) {
                    myScreen.current.srcObject = streamRef.current;
                }
                setToggleCamera(true);
            } catch (err) {
                console.error("Error toggling video:", err);
            }
        } else {
            stopTrack("video");
            setToggleCamera(false);
        }
    };


    const toggleAudio = async () => {
        if (!toggleMicrophone) {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const newAudioTrack = audioStream.getAudioTracks()[0];

                if (streamRef.current) {
                    const existingAudioTracks = streamRef.current.getAudioTracks();
                    if (existingAudioTracks.length > 0 && connectionRef.current) {
                        connectionRef.current.replaceTrack(existingAudioTracks[0], newAudioTrack, streamRef.current);
                    } else {
                        streamRef.current.addTrack(newAudioTrack);
                    }
                    setStream(streamRef.current);
                } else {
                    streamRef.current = audioStream;
                    setStream(audioStream);
                }
                setToggleMicrophone(true);
            } catch (err) {
                console.error("Error toggling audio:", err);
            }
        } else {
            stopTrack("audio");
            setToggleMicrophone(false);
        }
    };


    return (
        <div className="w-full h-screen relative">
            <div
                className={`w-full h-full flex justify-center absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 -z-50`}>
                {callAccepted && !callEnded && (
                    <video ref={receiverScreen} autoPlay className={`w-full`}/>
                )}
            </div>
            <div className="w-full flex items-center justify-center gap-5 bottom-0 absolute mb-10 z-50">
                <div style={{marginTop: "1rem"}}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{padding: "0.5rem", marginRight: "1rem"}}
                        className="text-black"
                    />
                    <input
                        type="text"
                        placeholder="ID to call"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                        style={{padding: "0.5rem", marginRight: "1rem"}}
                        className="text-black"
                    />
                    {callAccepted && !callEnded ? (
                        <button onClick={leaveCall} style={{padding: "0.5rem"}}>
                            End Call
                        </button>
                    ) : (
                        <button onClick={() => callUser(idToCall)} style={{padding: "0.5rem"}}>
                            Call
                        </button>
                    )}
                </div>
                <div>
                    {callAccepted && !callEnded && (
                        <button onClick={leaveCall} style={{padding: "0.5rem"}}>
                            End Call
                        </button>
                    )}
                </div>
                {receiver && !callAccepted && (
                    <div style={{marginTop: "1rem"}}>
                        <p>{name} is calling...</p>
                        <button onClick={answerCall} style={{padding: "0.5rem"}}>
                            Answer
                        </button>
                    </div>
                )}
                <button
                    onClick={toggleAudio}
                    className="flex items-center gap-2 px-5 py-5 bg-transparent border-2 border-solid border-gray-300 rounded-full"
                >
                    {!toggleMicrophone ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                </button>
                <button
                    onClick={toggleVideo}
                    className="flex items-center gap-2 px-5 py-5 bg-transparent border-2 border-solid border-gray-300 rounded-full"
                >
                    {!toggleCamera ? <VideoOff className="w-5 h-5"/> : <Video className="w-5 h-5"/>}
                </button>
                <button
                    className="flex items-center gap-2 px-5 py-5 bg-red-500 hover:bg-red-600 text-white border-2 border-transparent transition-colors rounded-full"
                >
                    <Phone className="w-5 h-5"/>
                </button>
            </div>
            {/* Local Video Preview */}
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
