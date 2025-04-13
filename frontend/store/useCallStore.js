import {create} from "zustand/react";

export const useCallStore = create((set) => ({
    me: '',
    idToCall: '',
    stream: null,
    remoteStream: null,
    caller: null,
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
    isMicrophoneOn: false,
    isVideoOn: false,
    isMicrophoneRemoteOn: false,
    isVideoRemoteOn: false,

    setMe: (me) => set({me}),
    setIdToCall: (idToCall) => set({idToCall}),
    setStream: (stream) => set({stream}),
    setRemoteStream: (remoteStream) => set({remoteStream}),
    setIsMicrophoneRemoteOn: (isMicrophoneRemoteOn) => set({isMicrophoneRemoteOn}),
    setIsVideoRemoteOn: (isVideoRemoteOn) => set({isVideoRemoteOn}),
    setCaller: (caller) => set({caller}),
    setCallerSignal: (signal) => set({callerSignal: signal}),
    setCallAccepted: (accepted) => set({callAccepted: accepted}),
    setCallEnded: (ended) => set({callEnded: ended}),
    toggleMicrophone: (state) => set({isMicrophoneOn: !state.isMicrophoneOn}),
    toggleVideo: (state) => set({isVideoOn: !state.isMicrophoneOn}),

    reset: () => set({
        me: '',
        caller: null,
        callerSignal: null,
        callAccepted: null,
        callEnded: null,
        isMicrophoneOn: false,
        isVideoOn: false,
        remoteStream: null
    }),
}))