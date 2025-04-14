// context/PeerContext.js
'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import { usePathname } from 'next/navigation';

const PeerContext = createContext();

export const PeerProvider = ({ children }) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [yourName, setYourName] = useState('Minh');
  const [callerName, setCallerName] = useState('');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const path = usePathname();
  
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);

  // Initialize peer connection and media stream
  useEffect(() => {
    const peer = new Peer();
    peerInstance.current = peer;

    peer.on('open', (id) => {
      localStorage.setItem('cid', id);
      setPeerId(id);
    });

    peer.on('call', (call) => {
      console.log('Incoming call received:', call);
      setCallerName(call.metadata?.name || 'Unknown');
      setRemoteMicOn(call.metadata?.micOn ?? true);
      setRemoteCameraOn(call.metadata?.cameraOn ?? true);
      setIncomingCall(call);
    });

    peer.on('connection', (conn) => {
      dataConnectionRef.current = conn;
      conn.on('data', handleData);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  // Handle media stream initialization when path changes
  useEffect(() => {
    let stream = null;

    const initMedia = async () => {
      try {
        if (path === '/video-call') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setMediaStream(stream);
          
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.play().catch(console.error);
          }
        }
      } catch (error) {
        console.error('Media initialization error:', error);
      }
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [path]);

  const handleData = (data) => {
    switch (data.type) {
      case 'status':
        setRemoteMicOn(data.micOn);
        setRemoteCameraOn(data.cameraOn);
        break;
      case 'intro':
        setCallerName(data.name || 'Unknown');
        break;
      case 'end-call':
        endCall();
        break;
      default:
        break;
    }
  };

  const sendStatus = (micStatus, camStatus) => {
    if (dataConnectionRef.current?.open) {
      dataConnectionRef.current.send({
        type: 'status',
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

      conn.on('open', () => {
        conn.send({
          type: 'intro',
          name: yourName || 'Anonymous',
        });
        sendStatus(micOn, cameraOn);
      });

      conn.on('data', handleData);

      incomingCall.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(console.error);
        }
      });

      incomingCall.on('close', endCall);
      setIncomingCall(null);
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const call = async (remotePeerId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play().catch(console.error);
      }

      const conn = peerInstance.current.connect(remotePeerId);
      dataConnectionRef.current = conn;

      conn.on('open', () => {
        sendStatus(micOn, cameraOn);
      });

      conn.on('data', handleData);

      const outgoingCall = peerInstance.current.call(remotePeerId, stream, {
        metadata: { name: yourName || 'Anonymous', micOn, cameraOn },
      });

      currentCallRef.current = outgoingCall;
      setIsInCall(true);

      outgoingCall.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(console.error);
        }
      });

      outgoingCall.on('close', endCall);
    } catch (error) {
      console.error('Error making call:', error);
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
      dataConnectionRef.current.send({ type: 'end-call' });
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

    setIsInCall(false);
    setCallerName('');
  };

  return (
    <PeerContext.Provider
      value={{
        peerId,
        remotePeerIdValue,
        setRemotePeerIdValue,
        yourName,
        setYourName,
        callerName,
        cameraOn,
        micOn,
        remoteCameraOn,
        remoteMicOn,
        isInCall,
        incomingCall,
        currentUserVideoRef,
        remoteVideoRef,
        toggleCamera,
        toggleMic,
        call,
        answerCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error('usePeer must be used within a PeerProvider');
  }
  return context;
};