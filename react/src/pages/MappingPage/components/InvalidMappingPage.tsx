import { Link } from "react-router-dom";

type InvalidMappingPageProps = {
    fileSeq: string | null | undefined;
};

export function InvalidMappingPage({ fileSeq }: InvalidMappingPageProps) {
    const isNoFile = fileSeq == null || fileSeq === "";
    return (
        <div className="flex flex-1 min-h-0 items-center justify-center bg-gray-50 p-4">
            <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-gray-700">
                    {isNoFile ? "Select a file from the dashboard to map." : "Invalid file."}
                </p>
                <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
}
