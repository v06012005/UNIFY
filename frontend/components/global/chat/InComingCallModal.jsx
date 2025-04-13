import {useCallStore} from "@/store/useCallStore";
import {useCall} from "@/hooks/useCall";
import {Phone, PhoneIncoming, PhoneOff} from "lucide-react";

export default function InComingCall() {

    const {incomingCall} = useCallStore();
    const {rejectCall, answerCall} = useCall();

    const handleAnswerCall = () => {
      const windown =   window.open(
          "/test-call",
          "_blank",
          `width=1200,height=600,left=${(window.screen.width - 1200) / 2},top=${
            (window.screen.height - 600) / 3
          }`
        );
        if(windown){
            windown.onload = () => {
                answerCall();
            }
        }
    }

    if(!incomingCall) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl text-center w-80">
                <div className="flex flex-col items-center">
                    <PhoneIncoming className="text-green-500 w-12 h-12 mb-2"/>
                    <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
                        Incoming Call from <span className="font-bold">{caller}</span>
                    </h2>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleAnswerCall}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
                        >
                            <Phone className="w-5 h-5"/> Accept
                        </button>
                        <button
                            onClick={rejectCall}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow"
                        >
                            <PhoneOff className="w-5 h-5"/> Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}