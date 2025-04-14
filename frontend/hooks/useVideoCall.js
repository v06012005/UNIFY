import { useEffect, useRef } from "react";
import Peer from "peerjs";
import useCallStore from "../store/useCallStore";

export const useVideoCall = () => {
  const {
    peerId,
    incomingCall,
    isInCall,
    callerName,
    remoteStream,
    mediaStream,
    cameraOn,
    micOn,
    remoteCameraOn,
    remoteMicOn,
    setPeerId,
    setIncomingCall,
    setIsInCall,
    setCallerName,
    setRemoteStream,
    setMediaStream,
    setCameraOn,
    setMicOn,
    setRemoteCameraOn,
    setRemoteMicOn,
    resetCall,
  } = useCallStore();

  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);

  const initializePeer = () => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

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
        }
      });
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    peerInstance.current = peer;
    return () => peer.destroy();
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      return stream;
    } catch (err) {
      console.error("Failed to get media devices:", err);
      throw err;
    }
  };

  const sendStatus = (micStatus, camStatus) => {
    if (dataConnectionRef.current?.open) {
      dataConnectionRef.current.send({
        type: "status",
        micOn: micStatus,
        cameraOn: camStatus,
      });
    }
  };

  const answerCall = async () => {
    if (!incomingCall || !mediaStream) return;

    try {
      incomingCall.answer(mediaStream);
      currentCallRef.current = incomingCall;
      setIsInCall(true);

      const conn = peerInstance.current.connect(incomingCall.peer);
      dataConnectionRef.current = conn;

      conn.on("open", () => {
        conn.send({
          type: "intro",
          name: "Your Name", // Replace with actual name
        });
        sendStatus(micOn, cameraOn);
      });

      incomingCall.on("stream", (stream) => {
        setRemoteStream(stream);
      });

      incomingCall.on("close", endCall);
      setIncomingCall(null);
    } catch (err) {
      console.error("Error answering call:", err);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const call = (remotePeerId) => {
    if (!mediaStream) return;

    const conn = peerInstance.current.connect(remotePeerId);
    dataConnectionRef.current = conn;

    conn.on("open", () => {
      sendStatus(micOn, cameraOn);
    });

    const outgoingCall = peerInstance.current.call(remotePeerId, mediaStream, {
      metadata: {
        name: "Your Name", // Replace with actual name
        micOn,
        cameraOn,
      },
    });

    currentCallRef.current = outgoingCall;
    setIsInCall(true);

    outgoingCall.on("stream", (stream) => {
      setRemoteStream(stream);
    });

    outgoingCall.on("close", endCall);
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
      dataConnectionRef.current.close();
    }

    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    resetCall();
  };

  useEffect(() => {
    const cleanup = initializePeer();
    return cleanup;
  }, []);

  return {
    peerId,
    incomingCall,
    isInCall,
    callerName,
    remoteStream,
    mediaStream,
    cameraOn,
    micOn,
    remoteCameraOn,
    remoteMicOn,
    initializeMedia,
    answerCall,
    rejectCall,
    call,
    endCall,
    toggleCamera,
    toggleMic,
    setCallerName,
  };
};
