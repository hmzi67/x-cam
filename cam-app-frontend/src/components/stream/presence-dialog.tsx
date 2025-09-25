"use client";

import { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { Cross1Icon, PersonIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";
import { Participant } from "livekit-client";
import { useAuthToken } from "./token-context";

function ParticipantListItem({
  participant,
  isCurrentUser,
  isHost = false,
}: {
  participant: Participant;
  isCurrentUser: boolean;
  isHost?: boolean;
}) {
  const authToken = useAuthToken();
  const participantMetadata = (participant.metadata &&
    JSON.parse(participant.metadata)) as ParticipantMetadata;
  const room = useRoomContext();
  const roomMetadata = (room.metadata &&
    JSON.parse(room.metadata)) as RoomMetadata;

  const onInvite = async () => {
    // TODO: optimistic update
    await fetch("/api/invite_to_stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  // TODO: optimistic update
  const onRaiseHand = async () => {
    await fetch("/api/raise_hand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    });
  };

  // TODO: optimistic update
  const onCancel = async () => {
    await fetch("/api/remove_from_stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  function HostActions() {
    if (!isCurrentUser) {
      if (
        participantMetadata?.invited_to_stage &&
        participantMetadata?.hand_raised
      ) {
        return (
          <Button
            size="1"
            className="bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            onClick={onCancel}
          >
            Remove
          </Button>
        );
      } else if (participantMetadata?.hand_raised) {
        return (
          <Flex gap="2">
            <Button
              size="1"
              className="bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
              onClick={onInvite}
            >
              Accept
            </Button>
            <Button
              size="1"
              className="bg-gray-700 hover:bg-gray-600 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
              onClick={onCancel}
            >
              Reject
            </Button>
          </Flex>
        );
      } else if (participantMetadata?.invited_to_stage) {
        return (
          <Button
            size="1"
            className="bg-gray-700 text-gray-400 border-none"
            disabled
          >
            Pending
          </Button>
        );
      } else if (!participantMetadata?.invited_to_stage) {
        return (
          <Button
            size="1"
            className="bg-purple-600 hover:bg-purple-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            onClick={onInvite}
          >
            Invite
          </Button>
        );
      }
    }
    return null;
  }

  function ViewerActions() {
    if (isCurrentUser) {
      if (
        participantMetadata?.invited_to_stage &&
        participantMetadata?.hand_raised
      ) {
        return (
          <Button
            size="1"
            className="bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            onClick={onCancel}
          >
            Leave
          </Button>
        );
      } else if (
        participantMetadata?.invited_to_stage &&
        !participantMetadata?.hand_raised
      ) {
        return (
          <Flex gap="2">
            <Button
              size="1"
              className="bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
              onClick={onRaiseHand}
            >
              Accept
            </Button>
            <Button
              size="1"
              className="bg-gray-700 hover:bg-gray-600 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
              onClick={onCancel}
            >
              Reject
            </Button>
          </Flex>
        );
      } else if (
        !participantMetadata?.invited_to_stage &&
        participantMetadata?.hand_raised
      ) {
        return (
          <Button
            size="1"
            className="bg-yellow-600 hover:bg-yellow-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            onClick={onCancel}
          >
            Cancel
          </Button>
        );
      } else if (
        !participantMetadata?.invited_to_stage &&
        !participantMetadata?.hand_raised
      ) {
        return (
          <Button
            size="1"
            className="bg-purple-600 hover:bg-purple-700 text-white border-none cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
            onClick={onRaiseHand}
          >
            Raise Hand
          </Button>
        );
      }
    }
    return null;
  }

  // Get connection status
  const isPublishing = participant.permissions?.canPublish;
  const isOnStage =
    participantMetadata?.invited_to_stage && participantMetadata?.hand_raised;
  const handRaised = participantMetadata?.hand_raised;

  return (
    <div
      className={`p-2 rounded ${
        isCurrentUser ? "bg-[#2d2d33]" : "hover:bg-[#2d2d33]"
      } transition-colors`}
    >
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <div className="relative">
            <Avatar
              size="2"
              fallback={participant.identity[0] ?? <PersonIcon />}
              radius="full"
              className={isCurrentUser ? "bg-purple-600" : "bg-gray-700"}
            />
            {isOnStage && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#18181b] rounded-full"></span>
            )}
            {handRaised && !isOnStage && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-[#18181b] rounded-full"></span>
            )}
          </div>
          <div>
            <Text
              className={`font-medium ${
                isCurrentUser ? "text-purple-400" : "text-white"
              }`}
            >
              {participant.identity}
              {isCurrentUser && " (you)"}
            </Text>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              {isPublishing ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  Host
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                  Viewer
                </span>
              )}
              {handRaised && !isOnStage && (
                <span className="ml-2 flex items-center text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                  Hand Raised
                </span>
              )}
            </div>
          </div>
        </Flex>
        <div>
          {isHost && roomMetadata?.allow_participation ? (
            <HostActions />
          ) : (
            <ViewerActions />
          )}
        </div>
      </Flex>
    </div>
  );
}

export function PresenceDialog({
  children,
  isHost = false,
}: {
  children: React.ReactNode;
  isHost?: boolean;
}) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hosts = participants.filter(
    (participant) => participant.permissions?.canPublish ?? false
  );
  const viewers = participants.filter(
    (participant) => !participant.permissions?.canPublish
  );

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <div
          className="relative cursor-pointer hover:opacity-80 active:scale-95 transform transition-all duration-150"
          onClick={() => setIsDialogOpen(true)}
          role="button"
          aria-label="Show participants"
          tabIndex={0}
        >
          {children}
        </div>
      </Dialog.Trigger>

      <Dialog.Content
        style={{ maxWidth: 450 }}
        className="bg-[#18181b] border border-gray-800 text-white"
      >
        <Dialog.Title>
          <Flex justify="between" align="center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="font-medium">Stream Participants</span>
            </div>
            <Dialog.Close>
              <IconButton
                variant="ghost"
                color="gray"
                className="cursor-pointer hover:bg-gray-800 active:scale-95 transform duration-150"
              >
                <Cross1Icon />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        <div className="p-2 mt-2 max-h-[400px] overflow-y-auto">
          {hosts.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 bg-purple-900/30 border-l-4 border-purple-500 mb-2">
                <Text size="1" className="uppercase font-bold text-purple-400">
                  {hosts.length > 1 ? "Co-Hosts" : "Host"} ({hosts.length})
                </Text>
              </div>
              <div className="space-y-2">
                {hosts.map((participant) => (
                  <ParticipantListItem
                    key={participant.identity}
                    participant={participant}
                    isCurrentUser={
                      participant.identity === localParticipant.identity
                    }
                    isHost={isHost}
                  />
                ))}
              </div>
            </div>
          )}
          {viewers.length > 0 && (
            <div>
              <div className="px-2 py-1 bg-gray-800 border-l-4 border-gray-600 mb-2">
                <Text size="1" className="uppercase font-bold text-gray-300">
                  Viewers ({viewers.length})
                </Text>
              </div>
              <div className="space-y-2">
                {viewers.map((participant) => (
                  <ParticipantListItem
                    key={participant.identity}
                    participant={participant}
                    isCurrentUser={
                      participant.identity === localParticipant.identity
                    }
                    isHost={isHost}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <Flex justify="between" align="center">
            <Text size="1" className="text-gray-400">
              Total participants: {participants.length}
            </Text>
            <Button
              variant="solid"
              color="gray"
              className="bg-gray-700 hover:bg-gray-600 cursor-pointer hover:shadow-md active:scale-95 transform duration-150"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </Flex>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
