"use client";

import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import {useCall} from "@/components/provider/CallProvider";

const Page = () => {

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
        myScreen
    } = useCall();

    return (
        <div className="w-full h-screen relative">

            <div className="w-full h-full flex justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-50">
                {callAccepted && !callEnded && (
                    <div className={`w-full relative`}>
                        {
                           !isOffCamera && (
                                <div className={`w-full h-screen absolute top-0 left-0 bg-gray-400 z-50`}>
                                    <h3 className={`text-4xl`}>{name}</h3>
                                </div>
                            )
                        }
                        <video ref={receiverScreen} autoPlay playsInline className="w-full h-screen object-center z-10 transform scale-x-[-1]"/>
                    </div>
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
                        <button onClick={leaveCall} ref={btnRef} style={{ padding: "0.5rem" }}>
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
                    className="w-48 h-36 rounded-2xl m-3 transform scale-x-[-1]"
                />
            </div>
        </div>
    );
};

export default Page;
