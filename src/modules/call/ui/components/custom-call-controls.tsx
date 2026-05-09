import {
  useCall,
  useCallStateHooks,
  ScreenShareButton,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  RecordCallButton,
} from "@stream-io/video-react-sdk";
import { LogOut, Mic, Users2 } from "lucide-react";
import { useState } from "react";

export const CustomCallControls = ({ onLeave }: { onLeave: () => void }) => {
  const call = useCall();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [showParticipants, setShowParticipants] = useState(false);

  const handleMuteParticipant = async (userId: string) => {
    if (!call) return;
    try {
      // Mute participant's audio
      await call.muteUser(userId, "audio");
      console.log(`Participant ${userId} muted`);
    } catch (error) {
      console.error("Error muting participant:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Participants List */}
      {showParticipants && (
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3 text-white">
            Participants ({participants.length})
          </h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.sessionId}
                className="flex items-center justify-between bg-white/5 p-2 rounded"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {participant.image && (
                    <img
                      src={participant.image}
                      alt={participant.name}
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                  )}
                  <span className="text-sm text-white truncate">
                    {participant.name || "Participant"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMuteParticipant(participant.userId)}
                    className="p-1 hover:bg-white/10 rounded text-yellow-400 hover:text-yellow-300 transition-colors"
                    title="Mute"
                  >
                    <Mic className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <ToggleAudioPublishingButton />
        <ToggleVideoPublishingButton />
        <ScreenShareButton />
        <RecordCallButton />

        {/* Participants Toggle */}
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2 transition-colors"
          title="Show/hide participants"
        >
          <Users2 className="size-4" />
          <span className="text-sm">Participants</span>
        </button>

        {/* Leave Button */}
        <button
          onClick={onLeave}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
          title="Leave call"
        >
          <LogOut className="size-4" />
          <span className="text-sm">Leave</span>
        </button>
      </div>
    </div>
  );
};
