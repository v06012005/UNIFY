import {useEffect, useRef} from "react";
import {useCallStore} from "@/store/useCallStore";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import Cookies from "js-cookie";
import Peer from "simple-peer";
import {usePathname} from "next/navigation";


export const useCall = () => {
    const peerRef = useRef(null);
    const stompClientRef = useRef(null);
    const path = usePathname();
    const {
        me,
        idToCall,
        stream,
        setStream,
        remoteStream,
        setRemoteStream,
        caller,
        setCaller,
        callerSignal,
        setCallerSignal,
        callAccepted,
        setCallAccepted,
        callEnded,
        setCallEnded,
        isMicrophoneOn,
        toggleMicrophone,
        isVideoOn,
        toggleVideo,
        setIsMicrophoneRemoteOn,
        setIsVideoRemoteOn
    } = useCallStore();

    useEffect(() => {
       if(path === '/video-call'){
           navigator.mediaDevices.getUserMedia({video: true, audio: true})
               .then((currentStream) => setStream(currentStream));

           const sockJs = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws?token=${Cookies.get("token")}`);
           const stomp = new Client({
               webSocketFactory: () => sockJs,
               onConnect: () => {
                   stomp.subscribe(`/user/${me}/topic/call`, (signal) => {
                       const data = JSON.parse(signal.body);
                       setCaller(data.from);
                       setCallerSignal(data.signalData);
                   });
               },
               onError: (err) => console.log(err),
           });

           stomp.activate();
           stompClientRef.current = stomp;
       }
    }, [me, path]);

    const callUser = () => {
       if(idToCall){
           console.log(idToCall)
           const peer = new Peer({
               initiator: true,
               trickle: false,
               stream: stream,
           });

           peer.on('signal', (signal) => {
               stompClientRef.current.publish({
                   destination: "/app/call",
                   body: JSON.stringify({
                       userToCall: idToCall,
                       signalData: signal,
                       from: me,
                   }),
               })
           });

           peer.on('stream', (remoteStream) => {
               setIsMicrophoneRemoteOn(remoteStream.getAudioTracks()[0].enabled);
               setIsVideoRemoteOn(remoteStream.getVideoTracks()[0].enabled);
               setRemoteStream(remoteStream);
           });

           peerRef.current = peer;
       }

    }

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        })

        peer.on("signal", (signal) => {
            stompClientRef.current.publish({
                destination: "/app/answer",
                body: JSON.stringify({
                    to: caller,
                    from: me,
                    signalData: signal,
                })
            });
        });

        peer.on('stream', (remoteStream) => {
            setIsMicrophoneRemoteOn(remoteStream.getAudioTracks()[0].enabled);
            setIsVideoRemoteOn(remoteStream.getVideoTracks()[0].enabled);
            setRemoteStream(remoteStream);
        });

        peer.signal(callerSignal);
        peerRef.current = peer;

    }

    const leaveCall = () => {
        setCallEnded(true);
        peerRef.current.destroy();
        reset();
    }

    return {callUser, answerCall, leaveCall}


}