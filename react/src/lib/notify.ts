import { toast } from "sonner";

export type NotifyAction = {
    label: string;
    onClick: () => void;
};

export type NotifyOptions = {
    description?: string;
    action?: NotifyAction;
    id?: string | number;
};

const SUCCESS_DURATION_MS = 4000;
const INFO_DURATION_MS = 4000;
const WARNING_DURATION_MS = 5000;
const ERROR_DURATION_MS = 6000;

/**
 * Centralized toast API for the app. Routes everything through Sonner
 * with consistent defaults so individual callers do not set variants,
 * durations or ARIA semantics themselves. Use this helper instead of
 * calling `sonner`'s `toast` directly.
 *
 * Accepts any string message, including `i18next`'s `t(...)` output.
 */
export const notify = {
    /**
     * Confirms a user-initiated action that completed successfully
     * (upload done, user deleted, ...). Avoid for silent background
     * refetches.
     */
    success(message: string, options?: NotifyOptions) {
        return toast.success(message, {
            id: options?.id,
            description: options?.description,
            action: options?.action,
            duration: SUCCESS_DURATION_MS,
        });
    },

    /**
     * Reports a failure of a user-initiated action or a load error
     * that blocks the user from continuing. Shown slightly longer
     * than success toasts so the user has time to read the reason.
     */
    error(message: string, options?: NotifyOptions) {
        return toast.error(message, {
            id: options?.id,
            description: options?.description,
            action: options?.action,
            duration: ERROR_DURATION_MS,
        });
    },

    /**
     * Soft failure that is recoverable without a retry (invalid file,
     * blocked submit, validation issues). The user can adjust their
     * input and try again.
     */
    warning(message: string, options?: NotifyOptions) {
        return toast.warning(message, {
            id: options?.id,
            description: options?.description,
            action: options?.action,
            duration: WARNING_DURATION_MS,
        });
    },

    /**
     * Neutral information that is useful but not tied to a failure
     * (hints, background state changes the user asked for). Prefer
     * inline UI for persistent state.
     */
    info(message: string, options?: NotifyOptions) {
        return toast.info(message, {
            id: options?.id,
            description: options?.description,
            action: options?.action,
            duration: INFO_DURATION_MS,
        });
    },
};
