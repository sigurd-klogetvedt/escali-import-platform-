import { Button } from "@base-ui/react/button";
import type { TFunction } from "i18next";
import { ConflictActionBar } from "@/components/ConflictActionBar";
import type { Conflict } from "@/pages/MappingPage/utils/mappingLookupBuilders";

type MappingPageActionBarProps = {
    t: TFunction;
    conflicts: Conflict[];
    currentConflictIndex: number;
    onNextConflict: () => void;
    onPreviousConflict: () => void;
    onCancel: () => void;
    onReview: () => void;
    reviewDisabled: boolean;
};

export function MappingPageActionBar({
    t,
    conflicts,
    currentConflictIndex,
    onNextConflict,
    onPreviousConflict,
    onCancel,
    onReview,
    reviewDisabled,
}: MappingPageActionBarProps) {
    return (
        <div className="w-full h-13 bg-gray-50 flex items-center justify-between gap-2 px-2.5">
            <ConflictActionBar
                conflicts={conflicts}
                currentConflictIndex={currentConflictIndex}
                onNextConflict={onNextConflict}
                onPreviousConflict={onPreviousConflict}
            />
            <div className="flex gap-2 items-center justify-start">
                <Button
                    onClick={onCancel}
                    className="w-[176px] h-8 flex items-center justify-center gap-2 px-2 rounded-sm bg-white border border-neutral-200 font-medium text-sm text-black cursor-pointer hover:bg-neutral-50 transition"
                >
                    {t("mappingPage.cancelButton")}
                </Button>
                <Button
                    disabled={reviewDisabled}
                    onClick={onReview}
                    className="w-[176px] h-8 flex items-center justify-center gap-2 px-2 rounded-sm bg-[#1B1B1B] font-medium text-sm text-white cursor-pointer hover:bg-[#1B1B1B]/90 transition disabled:cursor-not-allowed disabled:bg-[#1B1B1B]/50"
                >
                    {t("mappingPage.reviewButton")}
                </Button>
            </div>
        </div>
    );
}
