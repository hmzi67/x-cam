"use client";

import { cn } from "@/lib/utils";
import {
  useLocalParticipant,
  useMediaDeviceSelect,
  useRoomContext,
} from "@livekit/components-react";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu, Flex } from "@radix-ui/themes";
import { ConnectionState } from "livekit-client";
import { useEffect, useState } from "react";

export function MediaDeviceSettings() {
  const { localParticipant } = useLocalParticipant();
  const [micEnabled, setMicEnabled] = useState(localParticipant.isMicrophoneEnabled);
  const [camEnabled, setCamEnabled] = useState(localParticipant.isCameraEnabled);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { state: roomState } = useRoomContext();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      void localParticipant.setMicrophoneEnabled(micEnabled);
      void localParticipant.setCameraEnabled(camEnabled);
    }
  }, [micEnabled, camEnabled, localParticipant, roomState]);

  const {
    devices: microphoneDevices,
    activeDeviceId: activeMicrophoneDeviceId,
    setActiveMediaDevice: setActiveMicrophoneDevice,
  } = useMediaDeviceSelect({
    kind: "audioinput",
  });

  const {
    devices: cameraDevices,
    activeDeviceId: activeCameraDeviceId,
    setActiveMediaDevice: setActiveCameraDevice,
  } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  return (
    <div className="relative">
      {/* <Button
        size="2"
        className={`bg-gray-800 hover:bg-gray-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150 ${settingsOpen ? 'ring-2 ring-purple-500' : ''} relative group`}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        <span className="flex items-center">
          Stream Settings
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Configure microphone and camera
          </span>
        </span>
      </Button> */}
      
      {settingsOpen && (
        <div className="absolute right-0 top-full mt-2 p-4 bg-[#18181b] border border-gray-800 rounded-md shadow-lg z-20 w-[300px]">
          <h3 className="text-white font-medium mb-4">Stream Settings</h3>
          
          <div className="space-y-4">
            {/* Microphone controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm">Microphone</label>
                <button
                  className={`px-2 py-1 rounded text-sm cursor-pointer hover:shadow-md active:scale-95 transform duration-150 ${
                    micEnabled 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => setMicEnabled(!micEnabled)}
                >
                  {micEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              <select
                className="w-full bg-[#2d2d33] text-white border-none rounded p-2 text-sm cursor-pointer transition-all duration-150 hover:bg-[#34343c] focus:ring-2 focus:ring-purple-500 outline-none"
                disabled={!micEnabled}
                value={activeMicrophoneDeviceId}
                onChange={(e) => setActiveMicrophoneDevice(e.target.value)}
              >
                {microphoneDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Camera controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm">Camera</label>
                <button
                  className={`px-2 py-1 rounded text-sm cursor-pointer hover:shadow-md active:scale-95 transform duration-150 ${
                    camEnabled 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => setCamEnabled(!camEnabled)}
                >
                  {camEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              <select
                className="w-full bg-[#2d2d33] text-white border-none rounded p-2 text-sm cursor-pointer transition-all duration-150 hover:bg-[#34343c] focus:ring-2 focus:ring-purple-500 outline-none"
                disabled={!camEnabled}
                value={activeCameraDeviceId}
                onChange={(e) => setActiveCameraDevice(e.target.value)}
              >
                {cameraDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Stream Quality</p>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded cursor-pointer hover:shadow-sm active:scale-95 transform duration-150">HD</button>
                <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded cursor-pointer hover:shadow-sm active:scale-95 transform duration-150">SD</button>
                <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded cursor-pointer hover:shadow-sm active:scale-95 transform duration-150">Auto</button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setSettingsOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}