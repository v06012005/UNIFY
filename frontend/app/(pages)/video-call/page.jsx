"use client";

import {useEffect, useRef, useState} from "react";
import { useCall } from "@/components/provider/CallProvider";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const VideoCallPage = () => {

    const {
        callAccepted,
        callEnded,
        isOffCamera,
        receiverScreen,
        setName,
        name,
        idToCall,
        setIdToCall,
        btnRef,
        leaveCall,
        callUser,
        receiver,
        answerCall,
        toggleAudio,
        toggleMicrophone,
        toggleVideo,
        toggleCamera,
        myScreen,
        stream,
        callDuration,
        nameReceiver,
        isOffMicrophone,
        callerSignal,
        stompClientRef,
    } = useCall();

    const [hasCalled, setHasCalled] = useState(false);
    const [userToCall, setUserToCall] = useState("");
    const [gradient, setGradient] = useState("radial-gradient(circle, #4B5EAA80, #1A1A3D80)");
    const btnAnswerRef = useRef(null);

    useEffect(() => {
        if (stream && myScreen.current && !myScreen.current.srcObject) {
            console.log("Attaching stream to myScreen");
            myScreen.current.srcObject = stream;
            myScreen.current.play().catch((err) => console.error("MyScreen play error:", err));
        }
        if (callAccepted && receiverScreen.current && receiverScreen.current.srcObject) {
            console.log("Receiver screen should be playing");
            receiverScreen.current.play().catch((err) => console.error("Receiver play error:", err));
        }
    }, [callAccepted, receiverScreen, stream]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            const { chatPartner: receivedId } = event.data;

            if (receivedId && !callAccepted && !callEnded && !receiver && !hasCalled) {
                console.log("Initiating call to:", receivedId);
                setIdToCall(receivedId);
                axios
                    .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${receivedId}`, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                    })
                    .then((response) => {
                        const user = response.data;
                        console.log("User info:", user);
                        setUserToCall(`${user.firstName} ${user.lastName}`);
                        setName(`${user.firstName} ${user.lastName}`);
                        if(stompClientRef.current){
                            callUser(receivedId);
                        }
                        setHasCalled(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching user info:", error);
                    });
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [callAccepted, callEnded, receiver, hasCalled, callUser, setIdToCall, setName, answerCall, callerSignal]);


    useEffect(() => {
        if (receiver && !callAccepted && btnAnswerRef.current) {
            const timer = setTimeout(() => {
                btnAnswerRef.current.click();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [receiver, callAccepted]);



    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const hasAudioTrack = stream && stream.getAudioTracks().length > 0;
    const hasVideoTrack = stream && stream.getVideoTracks().length > 0;

    return (
        <div className="w-full h-screen relative bg-gray-900 text-white flex flex-col overflow-hidden">


            <div className="w-full h-full flex justify-center items-center absolute top-0 left-0">
                {callAccepted && !callEnded ? (
                    <div className="w-full h-full relative">
                        <video
                            ref={receiverScreen}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        {!isOffCamera && (
                            <div
                                className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10"
                                style={{background: gradient}}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={!receiver ? 'https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg' : 'https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg'}
                                        alt="Avatar" className="w-20 h-20 rounded-full"/>
                                    <h3 className="text-4xl font-semibold">{nameReceiver}</h3>
                                </div>
                            </div>
                        )}
                        {callAccepted && !isOffMicrophone && (
                            <div className="absolute top-4 right-4 z-20 animate-mic-off">
                                <MicOff className="w-8 h-8 text-red-500 bg-gray-800 bg-opacity-70 p-1 rounded-full"/>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg z-50">
                            <p>{formatDuration(callDuration)}</p>
                        </div>
                    </div>
                ) : receiver && !callAccepted ? (
                    <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold">{nameReceiver} đang gọi bạn...</h1>
                    </div>
                ) : callEnded ? (
                    <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4">Cuộc gọi đã kết thúc</h1>
                        <p className="text-xl">Thời lượng cuộc gọi: {formatDuration(callDuration)}</p>
                        <button
                            onClick={() => window.close()}
                            className="mt-6 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                            <PhoneOff className="w-6 h-6"/>
                        </button>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center gap-4">
                        <img
                            src={'https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg'}
                            alt="Avatar" className="w-20 h-20 rounded-full"/>
                        <h1 className="text-2xl font-bold">Đang gọi {userToCall || "..."}</h1>
                    </div>
                )}
            </div>


            { callAccepted && !callEnded &&
                (<div className="absolute bottom-4 right-4 z-20">
                    <div
                        className="relative w-48 h-36 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]"
                        style={{boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}
                    >
                        <video
                            ref={myScreen}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full rounded-md transform scale-x-[-1]"
                        />
                        {callAccepted && !toggleCamera && (
                            <div
                                className="absolute inset-0 flex items-center justify-center z-10 animate-camera-off"
                                style={{background: gradient}}
                            >
                                <img
                                    src={
                                        receiver
                                            ? "https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg"
                                            : "https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg"
                                    }
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full"
                                />
                            </div>
                        )}
                    </div>
                </div>)
            }


            <div className="w-full flex justify-center items-center absolute bottom-0 p-6 z-30">
                {!callAccepted && !receiver && (
                    <div className="hidden items-center gap-4 bg-gray-800 p-4 rounded-xl shadow-lg">
                        <input
                            type="text"
                            placeholder="Tên của bạn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 rounded-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="ID người nhận"
                            value={idToCall}
                            onChange={(e) => setIdToCall(e.target.value)}
                            className="p-2 rounded-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={callUser(idToCall)}
                            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:bg-gray-500"
                            disabled={!name || !idToCall}
                        >
                            <Phone className="w-6 h-6"/>
                        </button>
                    </div>
                )}

                {receiver && !callAccepted && (
                    <div className="opacity-0 flex gap-4 items-center bg-gray-800 p-4 rounded-xl shadow-lg">
                        <p className="text-lg font-medium">{nameReceiver} đang gọi...</p>
                        <button
                            onClick={answerCall}
                             ref={btnAnswerRef}
                            className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                        >
                            <Phone className="w-6 h-6"/>
                        </button>
                        <button
                            onClick={leaveCall}
                            className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                            <PhoneOff className="w-6 h-6"/>
                        </button>
                    </div>
                )}

                {callAccepted && !callEnded && (
                    <div className="flex gap-6 bg-gray-800 p-4 rounded-xl shadow-lg">
                        <button
                            onClick={toggleAudio}
                            className={`p-3 rounded-full transition-colors ${
                                hasAudioTrack
                                    ? toggleMicrophone
                                        ? "bg-blue-500 hover:bg-gray-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    : "bg-gray-600 cursor-not-allowed"
                            }`}
                            disabled={!hasAudioTrack}
                        >
                            {hasAudioTrack ? (
                                toggleMicrophone ? <Mic className="w-6 h-6"/> : <MicOff className="w-6 h-6"/>
                            ) : (
                                <MicOff className="w-6 h-6 opacity-50"/>
                            )}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full transition-colors ${
                                hasVideoTrack
                                    ? toggleCamera
                                        ? "bg-gray-700 hover:bg-gray-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    : "bg-gray-600 cursor-not-allowed"
                            }`}
                            disabled={!hasVideoTrack}
                            title={hasVideoTrack ? "Bật/tắt video" : "Không có video"}
                        >
                            {hasVideoTrack ? (
                                toggleCamera ? <Video className="w-6 h-6"/> : <VideoOff className="w-6 h-6"/>
                            ) : (
                                <VideoOff className="w-6 h-6 opacity-50"/>
                            )}
                        </button>
                        <button
                            onClick={leaveCall}
                            ref={btnRef}
                            className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                            <PhoneOff className="w-6 h-6"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCallPage;