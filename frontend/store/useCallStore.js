import { create } from "zustand/react";

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
//   const currentUserVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerInstance = useRef(null);
//   const currentCallRef = useRef(null);
//   const dataConnectionRef = useRef(null);

const initialState = {
  me: "",
  idToCall: "",
  yourName: "",
  callerName: "",
  cameraOn: false,
  micOn: true,
  remoteCameraOn: false,
  remoteMicOn: true,
  mediaStream: null,
  incomingCall: null,
  isInCall: false,
};

export const useCallStore = create((set) => ({
  ...initialState,
  setState: (partial) => set((state) => ({ ...state, ...partial })),

  setMe: (me) => set({ me }),
  setIdToCall: (idToCall) => set({ idToCall }),
  setYourName: (yourName) => set({ yourName }),
  setCallerName: (callerName) => set({ callerName }),
  setCameraOn: (cameraOn) => set({ cameraOn }),
  setMicOn: (micOn) => set({ micOn }),
  setRemoteCameraOn: (remoteCameraOn) => set({ remoteCameraOn }),
  setRemoteMicOn: (remoteMicOn) => set({ remoteMicOn }),
  setMediaStream: (mediaStream) => set({ mediaStream }),
  setIncomingCall: (incomingCall) => set({ incomingCall }),
  setIsInCall: (isInCall) => set({ isInCall }),

  reset: () => set({ ...initialState }),
}));
