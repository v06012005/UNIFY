import { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useCallStore } from "@/store/useCallStore";
import { getUser } from "@/app/lib/dal";

export function useCall() {
  //   const [peerId, setPeerId] = useState('');
  //   const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  //   const [yourName, setYourName] = useState('');
  //   const [callerName, setCallerName] = useState('');
  //   const [cameraOn, setCameraOn] = useState(true);
  //   const [micOn, setMicOn] = useState(true);
  //   const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  //   const [remoteMicOn, setRemoteMicOn] = useState(true);
  //   const [mediaStream, setMediaStream] = useState(null);
  //   const [incomingCall, setIncomingCall] = useState(null);
  //   const [isInCall, setIsInCall] = useState(false);
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);

  const {
    me,
    idToCall,
    yourName,
    callerName,
    cameraOn,
    micOn,
    remoteCameraOn,
    remoteMicOn,
    mediaStream,
    incomingCall,
    isInCall,
    setState,
    setMe,
    setIdToCall,
    setYourName,
    setCallerName,
    setCameraOn,
    setMicOn,
    setRemoteCameraOn,
    setRemoteMicOn,
    setMediaStream,
    setIncomingCall,
    setIsInCall,
    reset,
  } = useCallStore();
  useEffect(() => {
    async function init() {
      const user = await getUser();
      const peer = new Peer(user.id);

      peer.on("call", (call) => {
        setCallerName(call.metadata?.name || "Unknown");
        setRemoteMicOn(call.metadata?.micOn ?? true);
        setRemoteCameraOn(call.metadata?.cameraOn ?? true);
        setIncomingCall(call);
      });

      peer.on("connection", (conn) => {
        dataConnectionRef.current = conn;
        conn.on("data", (data) => {
          if (data.type === "status") {
            setRemoteMicOn(data.micOn);
            setRemoteCameraOn(data.cameraOn);
          } else if (data.type === "intro") {
            setCallerName(data.name || "Unknown");
          } else if (data.type === "end-call") {
            endCall();
          }
        });
      });

      peerInstance.current = peer;
    }
    init();
  }, []);

  const sendStatus = (micStatus, camStatus) => {
    if (dataConnectionRef.current?.open) {
      dataConnectionRef.current.send({
        type: "status",
        micOn: micStatus,
        cameraOn: camStatus,
      });
    }
  };

  const answerCall = () => {
    if (!incomingCall) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMediaStream(stream);
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();

        incomingCall.answer(stream);
        currentCallRef.current = incomingCall;
        setIsInCall(true);

        const conn = peerInstance.current.connect(incomingCall.peer);
        dataConnectionRef.current = conn;

        conn.on("open", () => {
          conn.send({
            type: "intro",
            name: "Minh" || "Anonymous",
          });
          sendStatus(micOn, cameraOn);
        });

        conn.on("data", (data) => {
          if (data.type === "status") {
            setRemoteMicOn(data.micOn);
            setRemoteCameraOn(data.cameraOn);
          }
        });

        incomingCall.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });

        incomingCall.on("close", () => endCall());

        setIncomingCall(null);
      });
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const call = () => {
    if (idToCall) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMediaStream(stream);
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.play();
          }

          const conn = peerInstance.current.connect(remotePeerId);
          dataConnectionRef.current = conn;

          conn.on("open", () => {
            sendStatus(micOn, cameraOn);
          });

          conn.on("data", (data) => {
            if (data.type === "status") {
              setRemoteMicOn(data.micOn);
              setRemoteCameraOn(data.cameraOn);
            }
          });

          const outgoingCall = peerInstance.current.call(idToCall, stream, {
            metadata: { name: yourName || "Anonymous", micOn, cameraOn },
          });

          currentCallRef.current = outgoingCall;
          setIsInCall(true);

          outgoingCall.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });

          outgoingCall.on("close", () => {
            endCall();
          });
        });
    }
  };

  const toggleCamera = () => {
    if (!mediaStream) return;
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      const newStatus = !videoTrack.enabled;
      videoTrack.enabled = newStatus;
      setCameraOn(newStatus);
      sendStatus(micOn, newStatus);
    }
  };

  const toggleMic = () => {
    if (!mediaStream) return;
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      const newStatus = !audioTrack.enabled;
      audioTrack.enabled = newStatus;
      setMicOn(newStatus);
      sendStatus(newStatus, cameraOn);
    }
  };

  const endCall = () => {
    if (dataConnectionRef.current?.open) {
      dataConnectionRef.current.send({ type: "end-call" });
    }

    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (currentUserVideoRef.current) {
      currentUserVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    reset();
  };

  return {
    call,
    answerCall,
    endCall,
    toggleCamera,
    toggleMic,
    rejectCall,
  };
}
