"use client";

import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {Drawer,DrawerHeader,DrawerTitle,DrawerDescription, DrawerContent} from "@/components/ui/drawer";

import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps {
  open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const ResponsiveDialog=({
    open,
    onOpenChange,
    title,
    description,
    children
    }: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();
    
    if (isMobile) {
        return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>
            <div className="p-4">
                {children}
            </div>
            </DrawerContent >
        </Drawer>
        );
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            {children}
        </DialogContent>
        </Dialog>
    );
};