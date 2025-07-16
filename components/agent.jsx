'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';

const Agent = ({ userName, userId, type }) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState('INACTIVE');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus('ACTIVE');
    const onCallEnd = () => setCallStatus('FINISHED');

    const onMessage = (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Unexpected Error (object):', JSON.stringify(error, null, 2));
      } else {
        console.error('Unexpected Error (raw):', error);
      }
    };

    const onNetworkQuality = (event) => {
      console.warn('Network Quality Event:', event);
    };

    const onICEStateChange = (state) => {
      console.log('ICE State Change:', state);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);
    vapi.on('network-quality', onNetworkQuality);
    vapi.on('ice-state-change', onICEStateChange);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
      vapi.off('network-quality', onNetworkQuality);
      vapi.off('ice-state-change', onICEStateChange);
    };
  }, []);

  useEffect(() => {
    if (callStatus === 'FINISHED') {
      router.push('/');
    }
  }, [callStatus]);

  const handleCall = async () => {
    try {
      setCallStatus('CONNECTING');
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } catch (err) {
      console.error('Call Start Error:', err instanceof Error ? err.message : JSON.stringify(err));
      setCallStatus('INACTIVE');
    }
  };

  const handleDisconnect = async () => {
    await vapi.stop();
    setCallStatus('FINISHED');
    setTimeout(() => {
      setCallStatus('INACTIVE');
    }, 1000);
  };

  const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
  const isInactiveOrFinished = callStatus === 'INACTIVE' || callStatus === 'FINISHED';

  return (
    <div className="callview flex flex-col items-center justify-start min-h-screen px-10 py-8 gap-6 bg-black-100">
      {/* Avatar Cards */}
      <div className="flex gap-12">
        {/* AI Card */}
        <div className="cardinterviewer bg-black shadow-md border p-6 w-[400px] flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="z-10 flex items-center justify-center rounded-full size-[140px] bg-gradient-to-br from-blue-500 to-red-700 relative">
              {isSpeaking && (
                <span className="absolute inline-flex size-[90%] animate-ping rounded-full bg-primary-200 opacity-75" />
              )}
              <img src="/logo.svg" alt="Vapi" className="object-cover size-[120px] rounded-full z-10" />
            </div>
          </div>
          <h3 className="text-white font-semibold text-xl text-center">AI Interviewer</h3>
        </div>

        {/* User Card */}
        <div className="cardinterviewer bg-black shadow-md border p-6 w-[400px] flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="z-10 flex items-center justify-center rounded-full size-[140px] relative">
              <img src="/user-avatar.png" alt="User Avatar" className="object-cover size-[120px] rounded-full z-10" />
            </div>
          </div>
          <h3 className="text-white font-semibold text-xl text-center">You</h3>
        </div>
      </div>

      {/* Transcript Display */}
      {latestMessage && (
        <div className="transcript-border mt-6">
          <div className="transcript bg-gray-800 text-white px-4 py-2 rounded-md shadow">
            <p className="animate-fadeIn transition-opacity duration-500 opacity-100">{latestMessage}</p>
          </div>
        </div>
      )}

      {/* Button */}
      <div className="mt-4">
        {callStatus === 'ACTIVE' ? (
          <button className="btn-disconnect text-white bg-red-600 px-6 py-2 rounded" onClick={handleDisconnect}>
            END
          </button>
        ) : (
          <button
            className="btn-connect text-white bg-green-600 px-6 py-2 rounded"
            onClick={handleCall}
            disabled={!isInactiveOrFinished}
          >
            {isInactiveOrFinished ? 'Call' : '...'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;