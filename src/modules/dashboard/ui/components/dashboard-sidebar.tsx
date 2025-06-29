"use client"
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from  "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-buuton";

const firstSection=[
    {
        icon:VideoIcon,
        label:"Meetings",
        href:"/meetings"
    },
    {
        icon:BotIcon,
        label:"Agents",
        href:"/agents"
    },
];
const SecondSection=[
    {
        icon:StarIcon,
        label:"Upgrade",
        href:"/upgrade"
    }
];

export const DashboardSidebar=()=>{
   const pathname= usePathname();
  // const pathname="/meetings"
    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
               <Link href="/" className="flex items-center gap-2 px-2 pt-2">
               <Image src="/logo.png" height={36} width={36} alt="Logo"/>
               <p className="text-2xl font-semibold">AgentChat.AI</p>
               </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
              <Separator className="opacity-10 text-[#5D6B68]"/>
              </div>
              <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((items)=>(
                                <SidebarMenuItem key={items.href}>
                                    <SidebarMenuButton asChild className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from5% via-30% via-sidebar/50 to-sidebar/50"
                                        ,
                                        pathname===items.href && "bg-linear-to-r/oklch border-[#5d6b68]/10"
                                    )}
                                    isActive={pathname===items.href}
                                    >
                                        <Link href={items.href as any}>
                                            <items.icon className="h-4 w-4" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {items.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
              <Separator className="opacity-10 text-[#5D6B68]"/>
              </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SecondSection.map((items)=>(
                                <SidebarMenuItem key={items.href}>
                                    <SidebarMenuButton asChild>
                                        <Link href={items.href as any}>
                                            <items.icon className="h-4 w-4" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {items.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="text-white">
                 <DashboardUserButton/>
              </SidebarFooter>
            
        </Sidebar>
    )
}