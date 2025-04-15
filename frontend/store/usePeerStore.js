import { create } from "zustand";

export const usePeerStore = create((set, get) => ({
  peerId: "",
  remotePeerIdValue: "",
  yourName: "Minh",
  callerName: "",
  cameraOn: true,
  micOn: true,
  remoteCameraOn: true,
  remoteMicOn: true,
  mediaStream: null,
  incomingCall: null,
  isInCall: false,
  currentCall: null,
  dataConnection: null,

  // Actions
  setPeerId: (peerId) => set({ peerId }),
  setRemotePeerIdValue: (value) => set({ remotePeerIdValue: value }),
  setYourName: (name) => set({ yourName: name }),
  setCallerName: (name) => set({ callerName: name }),
  setCameraOn: (status) => set({ cameraOn: status }),
  setMicOn: (status) => set({ micOn: status }),
  setRemoteCameraOn: (status) => set({ remoteCameraOn: status }),
  setRemoteMicOn: (status) => set({ remoteMicOn: status }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  setIsInCall: (status) => set({ isInCall: status }),
  setCurrentCall: (call) => set({ currentCall: call }),
  setDataConnection: (conn) => set({ dataConnection: conn }),

  // Complex actions
  toggleCamera: () => {
    const { mediaStream, micOn, sendStatus, cameraOn } = get();
    if (!mediaStream) return;

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      const newStatus = !videoTrack.enabled;
      videoTrack.enabled = newStatus;
      set({ cameraOn: newStatus });
      sendStatus(micOn, newStatus);
    }
  },

  toggleMic: () => {
    const { mediaStream, cameraOn, sendStatus, micOn } = get();
    if (!mediaStream) return;

    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      const newStatus = !audioTrack.enabled;
      audioTrack.enabled = newStatus;
      set({ micOn: newStatus });
      sendStatus(newStatus, cameraOn);
    }
  },

  sendStatus: (micStatus, camStatus) => {
    const { dataConnection } = get();
    if (dataConnection?.open) {
      dataConnection.send({
        type: "status",
        micOn: micStatus,
        cameraOn: camStatus,
      });
    }
  },

  endCall: () => {
    const {
      dataConnection,
      currentCall,
      mediaStream,
      currentUserVideoRef,
      remoteVideoRef,
      setMediaStream,
      setIsInCall,
      setCallerName,
    } = get();

    if (dataConnection?.open) {
      dataConnection.send({ type: "end-call" });
    }

    if (currentCall) {
      currentCall.close();
      set({ currentCall: null });
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (currentUserVideoRef?.current) {
      currentUserVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef?.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsInCall(false);
    setCallerName("");
  },
}));
