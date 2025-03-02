"use client";

import { useCall } from "@/components/provider/CallProvider";
import { Phone, PhoneOff } from "lucide-react";
import {useApp} from "@/components/provider/AppProvider";
import {useEffect, useState} from "react";

const CallNotification = () => {

    const { receiver, leaveCall, name, callerSignal, caller, callEnded, nameReceiver, callAccepted } = useCall();
    const [accepted, setAccepted] = useState(false);

    const {user} = useApp()

    useEffect(() => {
        setAccepted(false);
    }, [callEnded]);


    if (!receiver || callAccepted || callEnded || accepted) return null;

    const handleAnswer = () => {
        const callWindow = window.open(
                "/video-call",
                "CallWindow",
                `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${(window.screen.height - 600) / 3}`
            );
            if (callWindow) {
                setAccepted(true);
                callWindow.onload = () => {
                    callWindow.postMessage(
                        { action: "answer", caller, signal: callerSignal, nameReceiver },
                        window.location.origin
                    );
                };
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fadeInUp">
            <div className="w-72 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 transform transition-all hover:scale-105">
                <div className="flex items-center gap-4">
                    <img
                        src={user.id === '58d8ce36-2c82-4d75-b71b-9d34a3370b16' ? 'https://i.pinimg.com/1200x/d2/f7/7e/d2f77e1984d947d02785f5a966e309dc.jpg' : 'https://file.hstatic.net/1000292100/file/img_1907_grande_e05accd5a03247069db4f3169cfb8b11_grande.jpg'}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                    <div className="flex-1">
                        <p className="text-lg font-semibold text-white">{name} đang gọi...</p>
                        <p className="text-sm text-gray-400">Cuộc gọi đến</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={handleAnswer}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-full transition-colors shadow-md"
                        title="Chấp nhận"
                    >
                        <Phone className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={leaveCall}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-md"
                        title="Từ chối"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotification;