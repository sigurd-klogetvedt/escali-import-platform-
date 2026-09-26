import { createColumnHelper } from "@tanstack/react-table";
import { type PreviewRowWithId } from "./tableUtils";
import { Checkbox } from "../Checkbox";

const col = createColumnHelper<PreviewRowWithId>();

/** Width matches body row height (`h-9` → 36px) for a square checkbox cell. */
export const ROW_CHECKBOX_COLUMN_PX = 36;

export const rowSelectionColumn = col.display({
    id: "_select",
    size: ROW_CHECKBOX_COLUMN_PX,
    minSize: ROW_CHECKBOX_COLUMN_PX,
    maxSize: ROW_CHECKBOX_COLUMN_PX,
    enableResizing: false,
    header: () => null,
    cell: ({ row }) => (
        <div className="flex h-full w-full items-center justify-center">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => row.toggleSelected(checked)}
            />
        </div>
    ),
})