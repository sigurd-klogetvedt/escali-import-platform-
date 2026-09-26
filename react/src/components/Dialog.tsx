import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps, ComponentPropsWithRef } from "react";
import React from "react";
import { cn } from "../lib/utils";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;
export const DialogClose = BaseDialog.Close;

type DialogOverlayProps = ComponentPropsWithRef<typeof BaseDialog.Backdrop>;

export const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof BaseDialog.Backdrop>,
    DialogOverlayProps
>(({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
        ref={ref}
        className={cn("fixed inset-0 z-100 bg-black/50", className)}
        {...props}
    />
));
DialogOverlay.displayName = "DialogOverlay";

type DialogContentProps = ComponentPropsWithRef<typeof BaseDialog.Popup>;

export const DialogContent = React.forwardRef<
    React.ElementRef<typeof BaseDialog.Popup>,
    DialogContentProps
>(({ className, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <BaseDialog.Viewport className="fixed inset-0 z-101 grid place-items-center p-4 h-dvh">
            <BaseDialog.Popup
                ref={ref}
                className={cn(
                    "base-ui-popup-animation w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg outline-none",
                    className
                )}
                {...props}
            />
        </BaseDialog.Viewport>
    </DialogPortal>
));
DialogContent.displayName = "DialogContent";

type DialogHeaderProps = ComponentProps<"div">;

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
    return (
        <div className={cn("flex flex-col text-lg text-left space-y-2", className)} {...props} />
    );
}

type DialogFooterProps = ComponentProps<"div">;

export function DialogFooter({ className, ...props }: DialogFooterProps) {
    return (
        <div
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}

type DialogTitleProps = ComponentPropsWithRef<typeof BaseDialog.Title>;

export const DialogTitle = React.forwardRef<
    React.ElementRef<typeof BaseDialog.Title>,
    DialogTitleProps
>(({ className, ...props }, ref) => (
    <BaseDialog.Title
        ref={ref}
        className={cn("text-lg font-medium leading-none tracking-tight", className)}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

type DialogDescriptionProps = ComponentPropsWithRef<typeof BaseDialog.Description>;

export const DialogDescription = React.forwardRef<
    React.ElementRef<typeof BaseDialog.Description>,
    DialogDescriptionProps
>(({ className, ...props }, ref) => (
    <BaseDialog.Description
        ref={ref}
        className={cn("text-sm text-gray-600 font-medium", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";