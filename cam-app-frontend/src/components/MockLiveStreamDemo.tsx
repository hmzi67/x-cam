"use client";
import { useState } from "react";

export default function MockLiveStreamDemo() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantCount, setParticipantCount] = useState(47);

  const participants = [
    { id: 1, name: "John Smith", isHost: true, isSpeaking: true },
    { id: 2, name: "Alice Johnson", isHost: false, isSpeaking: false },
    { id: 3, name: "Mike Wilson", isHost: false, isSpeaking: false },
    { id: 4, name: "Sarah Davis", isHost: false, isSpeaking: true },
  ];

  const chatMessages = [
    { id: 1, user: "TechEnthusiast", message: "Great explanation!", time: "2:34 PM" },
    { id: 2, user: "DevMaster", message: "Can you show the code again?", time: "2:35 PM" },
    { id: 3, user: "LearnToCode", message: "Thanks for the tutorial! 🎉", time: "2:36 PM" },
    { id: 4, user: "StreamViewer", message: "Very helpful content", time: "2:37 PM" },
  ];

  return (
    <div className="w-full h-screen bg-gray-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Stream Container */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {/* Main Speaker Video */}
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl font-bold">JS</span>
                </div>
                <h3 className="text-white text-2xl font-semibold">John Smith</h3>
                <p className="text-blue-200 mt-2">Host • Speaking</p>
              </div>
            </div>
            
            {/* Live Status Indicator */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm uppercase tracking-wide">Live</span>
                </div>
                <div className="text-white/70 text-sm">•</div>
                <div className="flex items-center space-x-1 text-white text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>{participantCount} viewers</span>
                </div>
              </div>
            </div>

            {/* Stream Title Overlay */}
            <div className="absolute top-6 right-6">
              <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                <h2 className="text-white font-semibold">Tech Talk - Latest Trends 2024</h2>
              </div>
            </div>
          </div>

          {/* Participant Gallery (Small Thumbnails) */}
          <div className="absolute bottom-20 right-6 flex flex-col space-y-2">
            {participants.slice(1).map((participant) => (
              <div key={participant.id} className="relative">
                <div className="w-20 h-16 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                {participant.isSpeaking && (
                  <div className="absolute -inset-0.5 bg-green-500 rounded-lg -z-10 animate-pulse"></div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs px-1 rounded">
                  {participant.name.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Control Bar */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm font-medium">
                Tech Talk Session
              </div>
              <div className="text-gray-400 text-sm">
                47 participants
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isVideoOff 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOff ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0018 13V7a2 2 0 00-2-2h-3.586l-1.707-1.707A1 1 0 0010 3H6.414l-2.707-2.707zm2.586 4L10 10l4 4h2V7h-3a1 1 0 01-.707-.293L11.586 6H10a1 1 0 00-.707.293L6.293 9.293z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v2.586l2.707-2.707A1 1 0 0116 6v8a1 1 0 01-1.707.707L12 12.414V14a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  </svg>
                )}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isScreenSharing 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </button>

              <button className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200">
                Raise Hand
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200">
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Live Chat</h3>
            <div className="flex items-center space-x-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V5zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {msg.user.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{msg.user}</span>
                    <span className="text-gray-500 text-xs">{msg.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1 break-words">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Participants Panel */}
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="p-4">
            <h4 className="text-white font-medium mb-3">Participants ({participantCount})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm flex-1">{participant.name}</span>
                  {participant.isHost && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Host</span>
                  )}
                  {participant.isSpeaking && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}