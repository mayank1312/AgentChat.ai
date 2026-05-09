import {
   SpeakerLayout,
   useCallStateHooks
} from "@stream-io/video-react-sdk"
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { CustomCallControls } from "./custom-call-controls";

interface Props {
    onLeave :()=>void;
    meetingName:string
}
export const CallActive=({onLeave,meetingName}:Props)=>{
  const {useParticipants} = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
        <div className="bg-[#101213] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                  <Image src="/logo.png" width={22} height={22} alt="Logo"/>
                </Link>
                <div>
                  <h4 className="text-base font-semibold">
                      {meetingName}
                  </h4>
                  <p className="text-xs text-gray-400">
                      Meeting in progress
                  </p>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
              <Users className="size-4"/>
              <span className="text-sm font-medium">{participants.length} {participants.length === 1 ? 'person' : 'people'}</span>
            </div>
        </div>
        <SpeakerLayout/>
        <div className="bg-[#101213] rounded-lg px-4 py-4">
            <CustomCallControls
            onLeave={onLeave}
            />
        </div>
    </div>
  )
}