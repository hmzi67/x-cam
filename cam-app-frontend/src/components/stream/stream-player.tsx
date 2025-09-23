import { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useDataChannel,
  useLocalParticipant,
  useMediaDeviceSelect,
  useParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import { CopyIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Avatar, Badge, Button, Dialog, Flex, Grid, Text } from "@radix-ui/themes";
import Confetti from "js-confetti";
import {
  ConnectionState,
  LocalVideoTrack,
  Track,
  createLocalTracks,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useAuthToken } from "./token-context";
import { MediaDeviceSettings } from "./media-device-settings";
import { PresenceDialog } from "./presence-dialog";
import { useCopyToClipboard } from "@/lib/clipboard";
import { useRouter } from "next/navigation";

function ConfettiCanvas() {
  const [confetti, setConfetti] = useState<Confetti>();
  const [decoder] = useState(() => new TextDecoder());
  const canvasEl = useRef<HTMLCanvasElement>(null);
  useDataChannel("reactions", (data) => {
    const options: { emojis?: string[]; confettiNumber?: number } = {};

    if (decoder.decode(data.payload) !== "🎉") {
      options.emojis = [decoder.decode(data.payload)];
      options.confettiNumber = 12;
    }

    confetti?.addConfetti(options);
  });

  useEffect(() => {
    setConfetti(new Confetti({ canvas: canvasEl?.current ?? undefined }));
  }, []);

  return <canvas ref={canvasEl} className="absolute h-full w-full" />;
}

export function StreamPlayer({ isHost = false }) {
  const [_, copy] = useCopyToClipboard();
  const router = useRouter();

  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>();
  const localVideoEl = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isMicToggling, setIsMicToggling] = useState(false);
  const [isCamToggling, setIsCamToggling] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [endStreamDialogOpen, setEndStreamDialogOpen] = useState(false);
  const [isEndingStream, setIsEndingStream] = useState(false);

  const { metadata, name: roomName, state: roomState } = useRoomContext();
  const roomMetadata = (metadata && JSON.parse(metadata)) as RoomMetadata;
  const { localParticipant } = useLocalParticipant();
  const localMetadata = (localParticipant.metadata &&
    JSON.parse(localParticipant.metadata)) as ParticipantMetadata;
  const canHost =
    isHost || (localMetadata?.invited_to_stage && localMetadata?.hand_raised);
  const isRoomCreator = roomMetadata?.creator_identity === localParticipant.identity;
  const participants = useParticipants();
  const showNotification = isHost
    ? participants.some((p) => {
        const metadata = (p.metadata &&
          JSON.parse(p.metadata)) as ParticipantMetadata;
        return metadata?.hand_raised && !metadata?.invited_to_stage;
      })
    : localMetadata?.invited_to_stage && !localMetadata?.hand_raised;

  useEffect(() => {
    if (canHost) {
      const createTracks = async () => {
        const tracks = await createLocalTracks({ audio: true, video: true });
        const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
        if (camTrack && localVideoEl?.current) {
          camTrack.attach(localVideoEl.current);
        }
        setLocalVideoTrack(camTrack as LocalVideoTrack);
      };
      void createTracks();
    }
  }, [canHost]);

  const { activeDeviceId: activeCameraDeviceId } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  useEffect(() => {
    if (localVideoTrack) {
      void localVideoTrack.setDeviceId(activeCameraDeviceId);
    }
  }, [localVideoTrack, activeCameraDeviceId]);

  const remoteVideoTracks = useTracks([Track.Source.Camera]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const remoteAudioTracks = useTracks([Track.Source.Microphone]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const authToken = useAuthToken();
  const [leaveStageDialogOpen, setLeaveStageDialogOpen] = useState(false);
  const [isLeavingStage, setIsLeavingStage] = useState(false);
  
  const onLeaveStage = async () => {
    try {
      setIsLeavingStage(true);
      await fetch("/api/remove_from_stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({
          identity: localParticipant.identity,
        }),
      });
      setLeaveStageDialogOpen(false);
    } catch (error) {
      console.error("Error leaving stage:", error);
    } finally {
      setIsLeavingStage(false);
    }
  };
  
  const stopStream = async () => {
    if (!isRoomCreator) return;
    
    try {
      setIsEndingStream(true);
      const response = await fetch("/api/stop_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        }
      });
      
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to stop stream");
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
    } finally {
      setIsEndingStream(false);
      setEndStreamDialogOpen(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-[#0e0e10]">
      {/* End Stream Confirmation Dialog */}
      <Dialog.Root open={endStreamDialogOpen} onOpenChange={setEndStreamDialogOpen}>
        <Dialog.Content 
          style={{ maxWidth: 450 }} 
          className="bg-[#18181b] border border-gray-800 text-white shadow-xl rounded-lg animate-in fade-in-50 zoom-in-95 duration-200"
        >
          <div className="p-6">
            <Dialog.Title className="text-xl text-white font-semibold mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
                    <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
                    <path d="M12 2v4"></path>
                    <path d="m2 2 20 20"></path>
                  </svg>
                </div>
                End stream?
              </div>
            </Dialog.Title>
            <Dialog.Description size="3" className="text-gray-800 mt-4">
              This will end your current livestream for all viewers. Are you sure you want to end it?
            </Dialog.Description>

            <Flex gap="4" mt="6" justify="end">
              <Dialog.Close>
                <Button 
                  size="3"
                  variant="soft" 
                  className="bg-gray-700 hover:bg-gray-600 text-white border-none px-4 py-2"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button 
                size="3"
                variant="solid" 
                className="bg-red-600 hover:bg-red-700 text-white border-none px-6 py-2 font-medium"
                onClick={stopStream}
                disabled={isEndingStream}
              >
                {isEndingStream ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ending stream...
                  </div>
                ) : "End Stream"}
              </Button>
            </Flex>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      
      {/* Leave Stage Confirmation Dialog */}
      <Dialog.Root open={leaveStageDialogOpen} onOpenChange={setLeaveStageDialogOpen}>
        <Dialog.Content 
          style={{ maxWidth: 450 }} 
          className="bg-[#18181b] border border-gray-800 text-white shadow-xl rounded-lg animate-in fade-in-50 zoom-in-95 duration-200"
        >
          <div className="p-6">
            <Dialog.Title className="text-xl text-white font-semibold mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                Leave stage?
              </div>
            </Dialog.Title>
            <Dialog.Description size="3" className="text-gray-300 mt-4">
              You will no longer be visible or audible in the stream. You can always request to join the stage again.
            </Dialog.Description>

            <Flex gap="4" mt="6" justify="end">
              <Dialog.Close>
                <Button 
                  size="3"
                  variant="soft" 
                  className="bg-gray-700 hover:bg-gray-600 text-white border-none px-4 py-2"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button 
                size="3"
                variant="solid" 
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-none px-6 py-2 font-medium"
                onClick={onLeaveStage}
                disabled={isLeavingStage}
              >
                {isLeavingStage ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Leaving...
                  </div>
                ) : "Leave Stage"}
              </Button>
            </Flex>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Grid className="w-full h-full absolute" gap="2">
        {canHost && (
          <div className="relative rounded-md overflow-hidden shadow-lg">
            <Flex
              className="absolute w-full h-full z-10"
              align="center"
              justify="center"
            >
              <Avatar
                size="9"
                fallback={localParticipant.identity[0] ?? "?"}
                radius="full"
                className="opacity-0 transition-opacity duration-300 bg-purple-600"
                style={{ opacity: localVideoTrack ? 0 : 0.9 }}
              />
            </Flex>
            <video
              ref={localVideoEl}
              className="absolute w-full h-full object-cover -scale-x-100 bg-transparent"
            />
            <div className="absolute w-full h-full">
              <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
              <Badge
                variant="solid"
                color="gray"
                className="absolute bottom-3 right-3 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full"
              >
                {localParticipant.identity} (you)
              </Badge>
            </div>
          </div>
        )}
        {remoteVideoTracks.map((t) => (
          <div key={t.participant.identity} className="relative rounded-md overflow-hidden shadow-lg">
            <Flex
              className="absolute w-full h-full z-10"
              align="center"
              justify="center"
            >
              <Avatar
                size="9"
                fallback={t.participant.identity[0] ?? "?"}
                radius="full"
                className="opacity-80 bg-purple-600 text-white"
              />
            </Flex>
            <VideoTrack
              trackRef={t}
              className="absolute w-full h-full object-cover bg-transparent"
            />
            <div className="absolute w-full h-full">
              <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
              <Badge
                variant="solid"
                color="gray"
                className="absolute bottom-3 right-3 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full"
              >
                {t.participant.identity}
              </Badge>
            </div>
          </div>
        ))}
      </Grid>
      {remoteAudioTracks.map((t) => (
        <AudioTrack trackRef={t} key={t.participant.identity} />
      ))}
      <ConfettiCanvas />
      <StartAudio
        label="Click to allow audio playback"
        className="absolute top-0 h-full w-full bg-black bg-opacity-70 backdrop-blur-sm text-white flex flex-col items-center justify-center gap-4"
      >
        <div className="bg-purple-600 p-4 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
        <p className="text-xl font-medium">Click to enable audio playback</p>
      </StartAudio>
      
      {/* Stream Controls Bar */}
      {canHost && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm py-3 px-5 rounded-full flex items-center space-x-4 z-20">
          {/* Microphone control */}
          <button 
            onClick={async () => {
              if (isMicToggling) return;
              
              try {
                setIsMicToggling(true);
                const newState = !micEnabled;
                if (roomState === ConnectionState.Connected) {
                  await localParticipant.setMicrophoneEnabled(newState);
                }
                setMicEnabled(newState);
              } finally {
                setTimeout(() => setIsMicToggling(false), 300); // Add small delay for better UX
              }
            }}
            className={`p-3 rounded-full ${micEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} transition-colors cursor-pointer hover:shadow-lg active:scale-95 transform duration-150 relative group`}
            title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
            disabled={isMicToggling}
          >
            {isMicToggling ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : micEnabled ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Mute Microphone
                </span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .95-.19 1.85-.52 2.67"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Unmute Microphone
                </span>
              </>
            )}
          </button>
          
          {/* Camera control */}
          <button 
            onClick={async () => {
              if (isCamToggling) return;
              
              try {
                setIsCamToggling(true);
                const newState = !camEnabled;
                if (roomState === ConnectionState.Connected) {
                  await localParticipant.setCameraEnabled(newState);
                }
                setCamEnabled(newState);
              } finally {
                setTimeout(() => setIsCamToggling(false), 300); // Add small delay for better UX
              }
            }}
            className={`p-3 rounded-full ${camEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'} transition-colors cursor-pointer hover:shadow-lg active:scale-95 transform duration-150 relative group`}
            title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
            disabled={isCamToggling}
          >
            {isCamToggling ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : camEnabled ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Turn Off Camera
                </span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 .66L23 7v10l-6-4"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Turn On Camera
                </span>
              </>
            )}
          </button>
          
          {/* Settings button */}
          {/* <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Stream Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button> */}
          
          {/* Stream control buttons */}
          {isRoomCreator ? (
            <button 
              onClick={() => setEndStreamDialogOpen(true)}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer hover:shadow-lg active:scale-95 transform duration-150 relative group"
              title="End Stream"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
                <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
                <path d="M12 2v4"></path>
                <path d="m2 2 20 20"></path>
              </svg>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                End Stream
              </span>
            </button>
          ) : (
            <button 
              onClick={() => setLeaveStageDialogOpen(true)}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer hover:shadow-lg active:scale-95 transform duration-150 relative group"
              title="Leave Stream"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Leave Stream
              </span>
            </button>
          )}
        </div>
      )}
      <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent">
        <Flex justify="between" align="end">
          <Flex gap="3" justify="center" align="center">
            <Button
              size="2"
              variant="soft"
              disabled={!Boolean(roomName)}
              className="bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer hover:shadow-md active:scale-95 transform duration-150 relative group"
              onClick={() => {
                if (!roomName) return;
                copy(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/watch/${roomName}`);
                
                // Get reference to the share button span element
                const shareButtonRef = document.querySelector('[data-share-button]');
                if (shareButtonRef) {
                  // Store original content
                  const originalContent = shareButtonRef.innerHTML;
                  
                  // Update with copied message
                  shareButtonRef.innerHTML = 'Copied!';
                  
                  // Restore after delay
                  setTimeout(() => {
                    shareButtonRef.innerHTML = originalContent;
                  }, 2000);
                }
              }}
            >
              {roomState === ConnectionState.Connected ? (
                <>
                  <span data-share-button className="flex items-center gap-1">
                    Share <CopyIcon />
                  </span>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Copy stream link
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              )}
            </Button>
            {roomName && canHost && (
              <Flex gap="3">
                <MediaDeviceSettings />
                {roomMetadata?.creator_identity !==
                  localParticipant.identity && (
                  <Button 
                    size="2" 
                    onClick={() => setLeaveStageDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150 relative group"
                  >
                    <span className="flex items-center">
                      Leave stage
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Exit from the live stream
                      </span>
                    </span>
                  </Button>
                )}
              </Flex>
            )}
          </Flex>
          <Flex gap="3" align="center">
            {roomState === ConnectionState.Connected && (
              <Text as="p" className="font-medium text-lg text-white">
                {roomName}
              </Text>
            )}
            <PresenceDialog isHost={isHost}>
              <div className="relative">
                {showNotification && (
                  <div className="absolute flex h-3 w-3 -top-1 -right-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </div>
                )}
                <Button
                  size="2"
                  variant="soft"
                  className="bg-gray-800 hover:bg-gray-700 text-white border-none flex items-center gap-2 cursor-pointer hover:shadow-md active:scale-95 transform duration-150 relative group"
                  disabled={roomState !== ConnectionState.Connected}
                >
                  {roomState === ConnectionState.Connected ? (
                    <>
                      <EyeOpenIcon />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        View Participants
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <EyeClosedIcon />
                      <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  {roomState === ConnectionState.Connected
                    ? participants.length
                    : ""}
                </Button>
              </div>
            </PresenceDialog>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
