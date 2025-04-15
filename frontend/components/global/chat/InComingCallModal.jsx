'use client';

import { usePeer } from '@/components/provider/PeerProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function GlobalCallNotification() {

const router = useRouter();
const [ callAccepted,
    setCallAccepted] = useState(false);

  const { 
    incomingCall, 
    callerName, 
    rejectCall,
  } = usePeer();

  if (callAccepted || !incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
      <div className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-700">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Incoming Call</h2>
        <p className="text-gray-300 mb-6">
          From: <span className="font-semibold text-gray-100">{callerName || 'Unknown'}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
                setCallAccepted(true);
                router.push('/video-call')
            }}
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
  );
}