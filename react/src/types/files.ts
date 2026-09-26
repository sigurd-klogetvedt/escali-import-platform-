export type UploadedFile = {
    FileSeq: number;
    OriginalFileName: string;
    FileStorageHash: string;
    FileType: string;
    FileSize: number;
    UploadedByUserSeq: number;
    IsMapped: boolean;
    InterfaceSeq: number | null;
    StatusSeq: number | null;
    CompanySeq: number;
    FileUploadedAt: string;
    LocalStorage: boolean;
};

export type UploadedFileAPIResponse = {
    FileSeq?: number;
    fileSeq?: number;
    OriginalFileName?: string;
    originalFileName?: string;
    FileType?: string;
    fileType?: string;
    FileSize?: number;
    fileSize?: number;
    FileUploadedAt?: string;
    fileUploadedAt?: string;
    IsMapped?: boolean;
    isMapped?: boolean;
    InterfaceSeq?: number | null;
    interfaceSeq?: number | null;
    StatusSeq?: number | null;
    statusSeq?: number | null;
    LocalStorage?: boolean;
    localStorage?: boolean;
};