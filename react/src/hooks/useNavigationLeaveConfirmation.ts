import { useEffect, useRef } from "react";
import { useBlocker, type Location as RouterLocation } from "react-router-dom";

export type NavigationLeaveContext = {
    currentLocation: RouterLocation;
    nextLocation: RouterLocation;
    historyAction: string;
};

export type UseNavigationLeaveConfirmationOptions = {
    /** When false, no navigations are blocked and beforeunload is not registered */
    when: boolean;
    /** Return true to allow the transition without prompting (e.g., Review route). */
    shouldAllowNavigation: (ctx: NavigationLeaveContext) => boolean;
    /** Message for `window.confirm` when an in-app navigation is blocked */
    confirmMessage: string;
    /** Register `beforeunload` when `when` is true (tab close / refresh). @default true */
    enableBeforeUnload?: boolean;
};

export function useNavigationLeaveConfirmation({
    when,
    shouldAllowNavigation,
    confirmMessage,
    enableBeforeUnload = true,
}: UseNavigationLeaveConfirmationOptions) {
    const blocker = useBlocker(({ currentLocation, nextLocation, historyAction }) => {
        if (!when) return false;
        return !shouldAllowNavigation({
            currentLocation,
            nextLocation,
            historyAction,
        });
    });

    const confirmingRef = useRef(false);

    useEffect(() => {
        if (blocker.state !== "blocked") {
            confirmingRef.current = false;
            return;
        }
        if (confirmingRef.current) return;
        confirmingRef.current = true;
        const ok = window.confirm(confirmMessage);
        confirmingRef.current = false;
        if (ok) {
            blocker.proceed();
        } else {
            blocker.reset();
        }
    }, [blocker.state, confirmMessage, blocker]);

    useEffect(() => {
        if (!when || !enableBeforeUnload) return;

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [when, enableBeforeUnload]);

    return blocker;
};