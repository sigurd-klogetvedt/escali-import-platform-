import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./Dialog";

interface DeleteDialogProps {
    sheetName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export function DeleteDialog({ sheetName, onDelete, onCancel, open, onOpenChange, isDeleting = false }: DeleteDialogProps) {
    const { t } = useTranslation();

    const handleOpenChange = (next: boolean) => {
        if (isDeleting) return;
        onOpenChange(next);
    };

    return <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="space-y-4 max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {t("deleteDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("deleteDialog.description", { sheetName })}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 rounded-sm bg-amber-100 w-full text-sm">{t("deleteDialog.warning")}</div>
                <DialogFooter className="pt-4 text-sm">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="rounded-sm bg-white border border-neutral-200 text-black hover:bg-neutral-100 transition-all h-8 px-2 flex items-center font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        {t("deleteDialog.cancelLabel")}
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="rounded-sm bg-red-500 text-white hover:bg-red-700 transition-all h-8 flex px-2 items-center font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
                    >
                        {isDeleting ? t("deleteDialog.deletingLabel") : t("deleteDialog.deleteLabel")}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>;
}
