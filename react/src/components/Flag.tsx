const FLAG_ASSETS: Partial<Record<string, string>> = {
    en: "/assets/svg/United Kingdom (GB).svg",
    no: "/assets/svg/Norway (NO).svg",
};

export type FlagCode = "en" | "no";

export interface FlagProps {
    /** Country/locale code: "en" | "no" */
    code: FlagCode;
    /** Size in pixels (width and height). Default 24. */
    size?: number;
    className?: string;
}

const DEFAULT_SIZE = 24;

export function Flag({ code, size = DEFAULT_SIZE, className }: FlagProps) {
    const src = FLAG_ASSETS[code];
    if (src) {
        return (
            <span
                className={className}
                style={{
                    width: size,
                    display: "inline-flex",
                    flexShrink: 0,
                }}
                aria-hidden
            >
                <img
                    src={src}
                    alt=""
                    width={size}
                    style={{ display: "block", objectFit: "cover" }}
                />
            </span>
        );
    }
}
