import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { GneneratedAvatarUri } from "@/lib/avatar";
import {DefaultVideoPlaceholder
    ,StreamVideoParticipant
    ,ToggleAudioPreviewButton
    ,ToggleVideoPreviewButton
    ,useCallStateHooks
    ,VideoPreview
} from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    onJoin :()=>void
    meetingId: string
}
const DisabledVideoPreview=()=>{
    const {data}=authClient.useSession();
    return (
        <DefaultVideoPlaceholder
        participant={
            {
                name:data?.user.name ?? "",
                image:
                    data?.user.image ??
                    GneneratedAvatarUri(
                        {
                        seed:data?.user.name??"",
                        variant:"initials"
                        }
                    )
            } as StreamVideoParticipant
        }
        />
    )
}

const AllowBrowserPermission=()=>{
    return (
        <p className="text-sm">
            Please grant your browser a permission to access your camera and microphone
        </p>
    )
}

const ShareMeetingLink = ({ meetingId }: { meetingId: string }) => {
    const [copied, setCopied] = useState(false);
    
    const meetingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/call/${meetingId}`;
    
    const handleCopy = () => {
        navigator.clipboard.writeText(meetingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-300 mb-2">Share this link to invite others:</p>
            <div className="flex items-center gap-2 bg-black/40 rounded p-2">
                <input
                    type="text"
                    value={meetingUrl}
                    readOnly
                    className="flex-1 bg-transparent text-white text-xs px-2 py-1 outline-none"
                />
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <Check className="size-4 text-green-400"/>
                    ) : (
                        <Copy className="size-4 text-white"/>
                    )}
                </button>
            </div>
        </div>
    );
};

export const CallLobby=({onJoin, meetingId}:Props)=>{
const {useCameraState,useMicrophoneState}=useCallStateHooks();
const {hasBrowserPermission:hasMicPermission}=useMicrophoneState();
const {hasBrowserPermission:hasCameraPermission}=useCameraState();
const hasBrowserMediaPermission= hasCameraPermission && hasMicPermission;
return (
    <div className="flex flex-col items-center justify-between h-full bg-radial from-sidebar-accent to-sidebar">
        <div className="py-4 px-8 flex flex-1 items-center justify-center w-full">
            <div className="flex flex-col items-center justify-between gap-y-6 bg-background rounded-lg p-10 shadow-sm max-w-2xl w-full">
                <div className="flex flex-col gap-y-2 text w-full">
                    <h6 className="text-lg font-medium">Ready To Join</h6>
                    <p className="text-sm text-gray-400">Set up your call before joining</p>
                </div>
                <VideoPreview
                 DisabledVideoPreview={
                    hasBrowserMediaPermission
                    ? DisabledVideoPreview
                    : AllowBrowserPermission
                 }
                />
                <div className="flex gap-x-2">
                    <ToggleAudioPreviewButton/>
                    <ToggleVideoPreviewButton/>
                </div>
                <ShareMeetingLink meetingId={meetingId}/>
                <div className="flex gap-x-2 justify-between w-full">
                    <Button asChild variant="ghost"><Link href="/meetings">Cancel</Link></Button>
                    <Button onClick={onJoin}> <LogInIcon/>Join Call</Button>
                </div>
            </div>
        </div>
    </div>
)
}