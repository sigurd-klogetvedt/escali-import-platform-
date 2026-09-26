type AdminFilesPanelProps = {
    title: string;
    description: string;
};

export const AdminFilesPanel = ({ title, description }: AdminFilesPanelProps) => {
    return (
        <div className="px-3 py-2 w-full">
            <div className="rounded-md border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-medium text-black">{title}</h3>
                <p className="mt-1 text-sm text-black/70">{description}</p>
            </div>
        </div>
    );
};
