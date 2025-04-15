import { create } from "zustand";

const useCallStore = create((set) => ({
  peerId: "",
  incomingCall: null,
  isInCall: false,
  callerName: "",
  remoteStream: null,
  mediaStream: null,
  cameraOn: true,
  micOn: true,
  remoteCameraOn: true,
  remoteMicOn: true,
  
  setPeerId: (id) => set({ peerId: id }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  setIsInCall: (status) => set({ isInCall: status }),
  setCallerName: (name) => set({ callerName: name }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
  setCameraOn: (status) => set({ cameraOn: status }),
  setMicOn: (status) => set({ micOn: status }),
  setRemoteCameraOn: (status) => set({ remoteCameraOn: status }),
  setRemoteMicOn: (status) => set({ remoteMicOn: status }),

  resetCall: () =>
    set({
      incomingCall: null,
      isInCall: false,
      callerName: "",
      remoteStream: null,
    }),
}));

export default useCallStore;
