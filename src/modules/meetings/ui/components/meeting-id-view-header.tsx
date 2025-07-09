interface Props{
    meetingId: string;
    meetingName: string;
    onEdit: () => void;
    onRemove: () => void;
}
import { Button } from "@/components/ui/button";
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const MeetingIdViewHeader = ({meetingId, meetingName, onEdit, onRemove}:Props) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl" >
                        <Link href="/meetings">My Meetings</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&> svg]:w-4 [&> svg]:h-4">
                    <ChevronRightIcon/>
                    </BreadcrumbSeparator>
                   <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl text-foreground" >
                        <Link href={`/meetings/${meetingId}`}>{meetingName}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <MoreVerticalIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onEdit}>
                       <PencilIcon className="w-4 h-4 text-black"/>
                        Edit Meeting
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove}>
                       <TrashIcon className="w-4 h-4 text-black"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};