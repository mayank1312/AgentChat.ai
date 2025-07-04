interface Props{
    agentId: string;
    agentName: string;
    onEdit: () => void;
    onRename: () => void;
}
import { Button } from "@/components/ui/button";
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const AgentIdViewHeader = ({agentId, agentName, onEdit, onRename}:Props) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl" >
                        <Link href="/agents">My Agents</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&> svg]:w-4 [&> svg]:h-4">
                    <ChevronRightIcon/>
                    </BreadcrumbSeparator>
                   <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl text-foreground" >
                        <Link href={`/agents/${agentId}`}>{agentName}</Link>
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
                        Edit Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRename}>
                       <TrashIcon className="w-4 h-4 text-black"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};