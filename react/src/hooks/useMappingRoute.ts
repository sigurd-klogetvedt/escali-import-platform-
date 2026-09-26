import { useLocation, useParams, useSearchParams } from "react-router-dom";

export type MappingRouteState = {
    fileSeq: string | undefined;
    fileSeqNum: number;
    isValidFile: boolean;
    interfaceSeq: number;
    interfaceName: string | undefined;
    localStorage: boolean;
}

export function useMappingRoute(): MappingRouteState {
    const { fileSeq } = useParams<{ fileSeq?: string}>();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const fileSeqNum = fileSeq != null && fileSeq !== "" ? Number(fileSeq) : NaN;
    const isValidFile = !Number.isNaN(fileSeqNum) && fileSeq != null && fileSeq !== "";

    const interfaceFromUrl = searchParams.get("interface");
    const interfaceSeqNum = interfaceFromUrl !== null ? Number(interfaceFromUrl) : NaN;
    const validInterface = Number.isInteger(interfaceSeqNum) && interfaceSeqNum > 0;
    const locationState = location.state as { interfaceSeq?: number; interfaceName?: string; localStorage?: boolean } | null;
    const interfaceSeq = validInterface ? interfaceSeqNum : locationState?.interfaceSeq ?? 0;
    const interfaceName = locationState?.interfaceName;
    const localStorage = locationState?.localStorage ?? false;

    return {
        fileSeq,
        fileSeqNum,
        isValidFile,
        interfaceSeq,
        interfaceName,
        localStorage,
    }
}