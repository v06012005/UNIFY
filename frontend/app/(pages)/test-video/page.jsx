'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

export default function VideoCallApp() {
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
  const currentUserVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCallRef = useRef(null);
  const dataConnectionRef = useRef(null);

  // Placeholder avatar
  const yourAvatar = 'https://via.placeholder.com/100';

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMediaStream(stream);
      const videoElement = currentUserVideoRef.current;

      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }

      videoElement.play().catch((err) => console.error('Play failed:', err));
    });

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
        } else if (data.type === 'intro') {
          setCallerName(data.name || 'Unknown');
        } else if (data.type === 'end-call') {
          endCall();
        }
      });
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
    };
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

    conn.on('data', (data) => {
      if (data.type === 'status') {
        setRemoteMicOn(data.micOn);
        setRemoteCameraOn(data.cameraOn);
      }
    });

    incomingCall.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => console.error('Play failed:', err));
    });

    incomingCall.on('close', () => endCall());

    setIncomingCall(null);
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
      const videoElement = currentUserVideoRef.current;

      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }

      videoElement.play().catch((err) => console.error('Play failed:', err));
      const conn = peerInstance.current.connect(remotePeerId);
      dataConnectionRef.current = conn;

      conn.on('open', () => {
        sendStatus(micOn, cameraOn);
      });

      conn.on('data', (data) => {
        if (data.type === 'status') {
          setRemoteMicOn(data.micOn);
          setRemoteCameraOn(data.cameraOn);
        }
      });

      const outgoingCall = peerInstance.current.call(remotePeerId, stream, {
        metadata: { name: yourName || 'Anonymous', micOn, cameraOn },
      });

      currentCallRef.current = outgoingCall;
      setIsInCall(true);

      outgoingCall.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch((err) => console.error('Play failed:', err));
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl h-[95vh] w-full overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">Video Call</h1>
          <p className="text-sm text-gray-400">Peer ID: <span className="font-semibold text-gray-200">{peerId || 'Loading...'}</span></p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {!isInCall && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={yourAvatar}
                  alt="Your Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                />
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name"
                  className="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-4 w-full max-w-md">
                <input
                  type="text"
                  value={remotePeerIdValue}
                  onChange={(e) => setRemotePeerIdValue(e.target.value)}
                  placeholder="Enter peer ID to call"
                  className="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => call(remotePeerIdValue)}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                  Join Call
                </button>
              </div>
            </div>
          )}

          {/* Video Feeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Your Video */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={yourAvatar}
                  alt="Your Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                />
                <p className="text-lg font-semibold text-gray-200">{yourName || 'You'}</p>
              </div>
              <video
                ref={currentUserVideoRef}
                className="w-full h-[90%] bg-black rounded-2xl object-cover"
                autoPlay
                muted
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-full ${
                    micOn ? 'bg-gray-700 bg-opacity-70' : 'bg-red-500'
                  } text-white`}
                >
                  {micOn ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM10.8 4.9c.1-.66.6-1.1 1.2-1.1s1.1.44 1.2 1.1v6.2c-.1.66-.6 1.1-1.2 1.1s-1.1-.44-1.2-1.1V4.9zM17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-full ${
                    cameraOn ? 'bg-gray-700 bg-opacity-70' : 'bg-red-500'
                  } text-white`}
                >
                  {cameraOn ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11.96l-4 3.98zM16 18H4V6h12v12z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11.96l-4 3.98zM16 18H4V6h12v12zm-2.29-13.71l-1.41 1.41-1.41-1.41-1.41 1.41-1.41-1.41-1.41 1.41L4.71 4.29 3.29 5.71 4.71 7.12l1.41-1.41 1.41 1.41 1.41-1.41 1.41 1.41 1.41-1.41 1.41 1.41 1.41-1.41-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Remote Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <p className="text-lg font-semibold text-gray-200">{callerName || 'Remote User'}</p>
              </div>
              <video
                ref={remoteVideoRef}
                className="w-full h-[90%] bg-black rounded-2xl object-cover"
                autoPlay
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {!remoteMicOn && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Mic Off</div>
                )}
                {!remoteCameraOn && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Camera Off</div>
                )}
              </div>
            </div>
          </div>

          {/* Call Controls */}
          {isInCall && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={endCall}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all"
              >
                End Call
              </button>
            </div>
          )}
        </div>

        {/* Incoming Call Modal */}
        {incomingCall && !isInCall && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-700">
              <h2 className="text-xl font-bold text-gray-100 mb-4">Incoming Call</h2>
              <p className="text-gray-300 mb-6">From: <span className="font-semibold text-gray-100">{callerName || 'Unknown'}</span></p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={answerCall}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCall}
                  className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}