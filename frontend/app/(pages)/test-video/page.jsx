'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

export default function VideoCallApp() {

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [yourName, setYourName] = useState('');
  const [callerName, setCallerName] = useState('');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      setCallerName(call.metadata?.name || 'Unknown');
      setRemoteMicOn(call.metadata?.micOn ?? true);
      setRemoteCameraOn(call.metadata?.cameraOn ?? true);
      setIncomingCall(call);
    });

    peer.on('connection', (conn) => {
      dataConnectionRef.current = conn;
      conn.on('data', (data) => {
        if (data.type === 'status') {
          setRemoteMicOn(data.micOn);
          setRemoteCameraOn(data.cameraOn);
        }else if (data.type === 'intro') {
            setCallerName(data.name || 'Unknown');
          }else if (data.type === 'end-call') {
            endCall(); 
          }
      });
    });


    peerInstance.current = peer;
  }, []);

  const sendStatus = (micStatus, camStatus) => {
    if (dataConnectionRef.current?.open) {
      dataConnectionRef.current.send({
        type: 'status',
        micOn: micStatus,
        cameraOn: camStatus,
      });
    }
  };

  const answerCall = () => {
    if (!incomingCall) return;
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMediaStream(stream);
      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.play();
  
      incomingCall.answer(stream);
      currentCallRef.current = incomingCall;
      setIsInCall(true);

      const conn = peerInstance.current.connect(incomingCall.peer);
      dataConnectionRef.current = conn;
  
      conn.on('open', () => {
        conn.send({
            type: 'intro',
            name: "Minh" || 'Anonymous',
          });
        sendStatus(micOn, cameraOn);
      });
  
      conn.on('data', (data) => {
        if (data.type === 'status') {
          setRemoteMicOn(data.micOn);
          setRemoteCameraOn(data.cameraOn);
        }
      });
  
      incomingCall.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
  
      incomingCall.on('close', () => endCall());
  
      setIncomingCall(null);
    });
  };
  

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const call = (remotePeerId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMediaStream(stream);
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();
      }

      const conn = peerInstance.current.connect(remotePeerId);
      dataConnectionRef.current = conn;

      conn.on('open', () => {
        sendStatus(micOn, cameraOn);
      });

      conn.on('data', (data) => {
        if (data.type === 'status') {
          setRemoteMicOn(data.micOn);
          setRemoteCameraOn(data.cameraOn);
        }});

      const outgoingCall = peerInstance.current.call(remotePeerId, stream, {
        metadata: { name: yourName || 'Anonymous', micOn, cameraOn },
      });

      currentCallRef.current = outgoingCall;
      setIsInCall(true);

      outgoingCall.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });

      outgoingCall.on('close', () => {
        endCall();
      });
    });
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
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold mb-4">🎥 React + PeerJS Video Call</h1>
      <p className="bg-gray-800 px-4 py-2 rounded">Your Peer ID: <b>{peerId || 'Loading...'}</b></p>

      {!isInCall && (
        <>
          <input
            type="text"
            className="px-4 py-2 text-black rounded"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Enter your name"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="px-4 py-2 text-black rounded"
              value={remotePeerIdValue}
              onChange={(e) => setRemotePeerIdValue(e.target.value)}
              placeholder="Enter peer ID to call"
            />
            <button
              onClick={() => call(remotePeerIdValue)}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              📞 Call
            </button>
          </div>
        </>
      )}

      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center">
          <p className="mb-1">👤 {yourName || 'You'}</p>
          <video ref={currentUserVideoRef} className="w-64 h-48 bg-black rounded" autoPlay muted />
        </div>
        <div className="relative flex flex-col items-center">
          <p className="mb-1">👥 {callerName || 'Remote User'}</p>
          <video ref={remoteVideoRef} className="w-64 h-48 bg-black rounded" autoPlay />

          {!remoteMicOn && (
            <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-xs rounded">🎤 Muted</div>
          )}
          {!remoteCameraOn && (
            <div className="absolute top-10 left-2 bg-red-600 px-2 py-1 text-xs rounded">📷 Off</div>
          )}
        </div>
      </div>

      {isInCall && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={toggleCamera}
            className={`px-4 py-2 rounded ${cameraOn ? 'bg-yellow-500' : 'bg-yellow-700'}`}
          >
            {cameraOn ? '📷 Camera Off' : '📷 Camera On'}
          </button>
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded ${micOn ? 'bg-purple-600' : 'bg-purple-800'}`}
          >
            {micOn ? '🎤 Mute' : '🎤 Unmute'}
          </button>
          <button
            onClick={endCall}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            ❌ End Call
          </button>
        </div>
      )}

      {incomingCall && !isInCall && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 px-6 py-4 rounded shadow-lg text-center z-50">
          <p className="mb-2">📲 Incoming call from: <b>{callerName || 'Unknown Caller'}</b></p>
          <div className="flex gap-4 justify-center">
            <button onClick={answerCall} className="bg-green-600 px-4 py-2 rounded">✅ Accept</button>
            <button onClick={rejectCall} className="bg-red-600 px-4 py-2 rounded">❌ Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}
