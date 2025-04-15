// context/PeerContext.js
'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import { usePathname } from 'next/navigation';
import { getUser } from '@/app/lib/dal';
import { useApp } from './AppProvider';

const PeerContext = createContext();

export const PeerProvider = ({ children }) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [yourName, setYourName] = useState('');
  const [callerName, setCallerName] = useState('');
  const avatarDefault = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcellphones.com.vn%2Fsforum%2Favatar-trang&psig=AOvVaw1tGu62oBQWs8Ln4Dowu7wc&ust=1744781189259000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMinvcqm2YwDFQAAAAAdAAAAABAE';
  const [avatarRemote, setAvatarRemote] = useState(avatarDefault);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const path = usePathname(); 
  
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);
  const {user} = useApp();

 
  useEffect(() => {
    async function initPeer() {
      const user = await getUser(); 
      let userId = user?.id || undefined;
      setYourName(`${user.firstName} ${user.lastName}`)

      let peer = new Peer(userId);

      peer.on('open', () => {
        localStorage.setItem('cid', userId);
        setPeerId(userId);
      });

      peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          console.warn('ID taken. Falling back to random ID.');
          peer = new Peer(); 
          setupPeerEvents(peer);
        } else {
          console.error('Peer error:', err);
        }
      });

      setupPeerEvents(peer);
      peerInstance.current = peer;
    }

    function setupPeerEvents(peer) {
      peer.on('call', (call) => {
        console.log('Incoming call:', call);
        setCallerName(call.metadata?.name || 'Unknown');
        setRemoteMicOn(call.metadata?.micOn ?? true);
        setRemoteCameraOn(call.metadata?.cameraOn ?? true);
        setAvatarRemote(call.metadata.avatar || avatarDefault);
        setIncomingCall(call);
      });

      peer.on('connection', (conn) => {
        dataConnectionRef.current = conn;
        conn.on('data', handleData);
      });
    }

    initPeer();

    return () => {
      peerInstance.current?.destroy();
    };
  }, []);
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
        setAvatarRemote(data.avatar || avatarDefault);
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
          avatar: user?.avatar?.url || "",
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

      const outgoingCall = peerInstance.current.call(idToCall || remotePeerId, stream, {
        metadata: { name: yourName || 'Anonymous', micOn, cameraOn, avatar: user.avatar.url || "" },
      });

      currentCallRef.current = outgoingCall;
      setIsInCall(true);

      outgoingCall.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch(console.error);
          };
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
        avatarRemote,
        setAvatarRemote,
        avatarDefault,
        idToCall,
        setIdToCall
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