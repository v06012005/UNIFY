'use client';

import { useState, useEffect } from 'react';
import { useApp } from "@/components/provider/AppProvider";
import { usePeer } from "@/components/provider/PeerProvider";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff } from 'lucide-react';
import Logo from "@/public/images/unify_darkmode_full.svg"
import { fetchUserId } from '@/app/lib/dal';

export default function VideoCallApp() {
  const { user } = useApp();

  const [onMounted, setOnMounted] = useState(false);
  const {
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
    idToCall,
    userToCall
  } = usePeer();

  const yourAvatar = 'https://via.placeholder.com/100';
  const [isScreenSharing, setIsScreenSharing] = useState(false);


  async function fetchUser() {
    const user = await fetchUserId(idToCall);
    return user;
  }


  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full bg-opacity-90 rounded-3xl shadow-2xl h-[95vh] overflow-hidden border border-gray-700">
        <div className="p-6 border-b w-full border-gray-700 flex items-center justify-between">
          <img alt='logo' src={Logo.src} width={100}/>
        </div>

        <div className="p-6">
          {((incomingCall && !isInCall) || (idToCall && !isInCall)) && (
            <button
              onClick={idToCall ? call : answerCall}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-blue-600 transition-all"
            >
              Join Call
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Local Video */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar.url}
                  alt="Your Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                />
                <p className="text-lg font-semibold text-gray-200">{yourName || 'You'}</p>
              </div>
              <div className="w-full relative h-[410px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden">
                <video
                  ref={currentUserVideoRef}
                  className={`w-full h-full object-cover ${!cameraOn && 'invisible'} z-10`} 
                  autoPlay
                  muted
                />
                {!cameraOn && (
                  <img
                    src={user.avatar.url}
                    alt="Your Avatar"
                    className="w-32 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-32 rounded-full object-cover border-2 border-gray-500 z-50"
                  />
                )}
              </div>
              <div className="absolute bottom-4 left-4 flex gap-4">
                <button
                  onClick={toggleMic}
                  className={`p-4 rounded-full ${
                    micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  } transition-colors duration-200`}
                  title={micOn ? 'Turn off microphone' : 'Turn on microphone'}
                >
                  {micOn ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full ${
                    cameraOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  } transition-colors duration-200`}
                  title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {cameraOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full ${
                    isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  } transition-colors duration-200`}
                  title={isScreenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
                >
                  <MonitorUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={userToCall ?  userToCall.avatar.url : avatarRemote}
                  alt="Remote Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <p className="text-lg font-semibold text-gray-200">{userToCall ? `${userToCall.firstName} ${userToCall.lastName}` : callerName}</p>
              </div>
              <div className="w-full relative h-[410px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  className={`w-full h-full object-cover ${!remoteCameraOn && 'invisible'} z-10`}
                  autoPlay
                />
                {
                  !isInCall && (
                    <p className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'>Connecting...</p>
                  )
                }
                {!remoteCameraOn && (
                  <img
                    src={avatarRemote || yourAvatar}
                    alt="Remote Avatar"
                    className="w-32 h-32 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover border-2 border-gray-500 z-50"
                  />
                )}
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                {!remoteMicOn && (
                  <div
                    className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center"
                    title="Microphone Off"
                  >
                    <MicOff className="w-5 h-5" />
                  </div>
                )}
                {!remoteCameraOn && (
                  <div
                    className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center"
                    title="Camera Off"
                  >
                    <VideoOff className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {isInCall && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
                title="End call"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}