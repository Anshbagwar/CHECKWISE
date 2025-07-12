import React from "react";

const Agent = ({ userName }) => {
  const isSpeaking = true;

  const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
  };

  const currentStatus = CallStatus.ACTIVE;
  const messages = ['Whats your name ?', 'My name is Ansh, Nice to meet you!'];
  const lastmessage = messages[messages.length - 1];

  return (
    <div className="callview flex flex-col items-center justify-start min-h-screen px-10 py-8 gap-6 bg-black-100">
      {/* Cards Row */}
      <div className="flex gap-12">
        {/* AI Interviewer Card */}
        <div className="cardinterviewer bg-black shadow-md border p-6 w-[400px] flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="z-10 flex items-center justify-center rounded-full size-[140px] bg-gradient-to-br from-blue-500 to-red-700 relative">
              {isSpeaking && (
                <span className="absolute inline-flex size-[90%] animate-ping rounded-full bg-primary-200 opacity-75" />
              )}
              <img
                src="/logo.svg"
                alt="Vapi"
                className="object-cover size-[120px] rounded-full z-10"
              />
            </div>
          </div>
          <h3 className="text-white font-semibold text-xl text-center">
            AI Interviewer
          </h3>
        </div>

        {/* User Card */}
        <div className="cardinterviewer bg-black shadow-md border p-6 w-[400px] flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="z-10 flex items-center justify-center rounded-full size-[140px] relative">
              <img
                src="/user-avatar.png"
                alt="User Avatar"
                className="object-cover size-[120px] rounded-full z-10"
              />
            </div>
          </div>
          <h3 className="text-white font-semibold text-xl text-center">
            You
          </h3>
        </div>
      </div>

      {/* Last Message Display */}
      {messages.length > 0 && (
        <div className="transcript-border mt-6">
          <div className="transcript bg-gray-800 text-white px-4 py-2 rounded-md shadow">
            <p className="animate-fadeIn transition-opacity duration-500 opacity-100">
              {lastmessage}
            </p>
          </div>
        </div>
      )}

      {/* Button Below */}
      <div className="mt-4">
        {currentStatus === CallStatus.ACTIVE ? (
          <button className="btn-disconnect text-white bg-red-600 px-6 py-2 rounded">
            END
          </button>
        ) : (
          <button className="btn-connect text-white bg-green-600 px-6 py-2 rounded">
            {currentStatus === CallStatus.INACTIVE || currentStatus === CallStatus.FINISHED
              ? "Call"
              : "..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
