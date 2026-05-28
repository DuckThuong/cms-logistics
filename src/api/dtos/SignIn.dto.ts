import type {Gender} from "@common/types/auth";

export interface SignInDto {
    userName: string;
    phoneNumber: string;
    acceptRole: string;
    gender: Gender;
    role: number;
    dateOfBirth: string;
    email: string;
}