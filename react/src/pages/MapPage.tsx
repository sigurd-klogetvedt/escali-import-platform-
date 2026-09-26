import { useParams } from "react-router-dom";

export const MapPage = () => {
    const { fileSeq } = useParams<{ fileSeq: string }>();
    const fileSeqNum = fileSeq !== null ? Number(fileSeq) : null;

    if (fileSeqNum === null || Number.isNaN(fileSeqNum)) {
        return <div>
            Invalid File
        </div>
    }

    return (
        <div className="flex-1 p-4">
            <h1>Map {fileSeqNum}</h1>
            
        </div>
    )
}