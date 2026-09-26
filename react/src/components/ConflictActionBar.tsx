import { cn } from "@/lib/utils"
import { Button } from "@base-ui/react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useTranslation } from "react-i18next";

const actionButtonClass = cn(
    "flex items-center justify-center h-7 w-7 rounded-sm transition",
    "hover:bg-neutral-200",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
)

type ConflictNavButtonProps = {
    disabled?: boolean
    onClick?: () => void
    children: React.ReactNode
};

type ConflictActionBarProps = {
    conflicts: { rowId: string; columnId: string; columnLabel: string }[]
    currentConflictIndex?: number
    onNextConflict?: () => void
    onPreviousConflict?: () => void
}

const ConflictNavButton = ({ disabled, onClick, children }: ConflictNavButtonProps) => (
    <Button disabled={disabled} onClick={onClick} className={actionButtonClass}>
        {children}
    </Button>
)

export const ConflictActionBar = ({
    conflicts,
    currentConflictIndex = 1,
    onNextConflict,
    onPreviousConflict,
}: ConflictActionBarProps) => {
    const totalConflicts = conflicts.length
    const selectedConflict = conflicts[Math.max(0, currentConflictIndex - 1)]
    const { t } = useTranslation()

    return (
        <div className="h-13 flex items-center justify-center px-4 py-2.5 gap-8">
        {totalConflicts === 0 ? (
            <p className="font-medium text-sm text-black">
                {t("conflictActionBar.noConflicts")}
            </p>
        ) : (
            <>
                <div className="flex items-center justify-start gap-2 h-7">
                    <p className="font-medium text-sm text-black">{t("conflictActionBar.currentCell")}:</p>
                    <div className="flex items-center justify-center h-7 gap-2.5 px-3 py-2.5 bg-[#2E68E6]/10 border border-[#2E68E6] rounded-full font-medium text-black text-sm">
                        {selectedConflict?.columnLabel ?? "—"}
                    </div>
                </div>
                <div className="h-7 gap-2 flex items-center justify-start">
                    <p className="font-medium text-sm text-black">
                        {String(totalConflicts === 0 ? 0 : currentConflictIndex).padStart(2, "0")} / {totalConflicts} {t("conflictActionBar.conflicts")}
                    </p>
                    <div className="flex items-center justify-start gap-1 h-7">
                        <ConflictNavButton
                            disabled={totalConflicts === 0 || (totalConflicts > 1 && currentConflictIndex === totalConflicts)}
                            onClick={onNextConflict}
                        >
                            <ArrowDown className="h-4 w-4 text-black" />
                        </ConflictNavButton>
                        <ConflictNavButton
                            disabled={totalConflicts === 0 || (totalConflicts > 1 && currentConflictIndex === 1)}
                            onClick={onPreviousConflict}
                        >
                            <ArrowUp className="h-4 w-4 text-black" />
                        </ConflictNavButton>
                    </div>
                </div>
                </>
        )}
        </div>
    )
}