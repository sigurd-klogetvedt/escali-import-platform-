export type CurrentUserResponse = {
    isValid: boolean;
    userId: string | null;
    companyId: string | null;
    isAdmin: boolean;
    permission: string | null;
    email: string | null;
};

export type AdminUser = {
    UserSeq: number;
    Email: string;
    DisplayName: string;
    IsAdmin: boolean;
    IsActive: boolean;
    LastLoginAt: string | null;
    UserCreated: string;
};
