import { useEffect } from "react";
import { useMappingStore } from "@/stores/mappingStore";

// Persists across remounts so we only reset once per (file, interface, storage) trio.
let lastResetMappingSessionKey: string | null = null;

export function useMappingSessionReset(params: {
    fileSeqNum: number;
    interfaceSeq: number;
    localStorage: boolean;
}) {
    const { fileSeqNum, interfaceSeq, localStorage } = params;
    const resetMappingUi = useMappingStore((s) => s.resetMappingUi);

    useEffect(() => {
        const sessionKey = `${fileSeqNum}:${interfaceSeq}:${localStorage}`;
        if (lastResetMappingSessionKey !== sessionKey) {
            lastResetMappingSessionKey = sessionKey;
            resetMappingUi();
        }
    }, [fileSeqNum, interfaceSeq, localStorage, resetMappingUi]);
}
