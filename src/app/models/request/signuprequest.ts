export interface SignUpRequest {
    name?: string;
    lastName?: string;
    password?: string;
    confirmationPassword?: string;
    email?: string;
    country?: string;
    phoneNumber?: number;
    marketplace?: number;
}