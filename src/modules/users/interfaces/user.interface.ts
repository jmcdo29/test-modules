import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: any;
    created: Date;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    username: string;
    active: boolean;
    password: string;
    profileImageURL: string;
    salt: string;
    provider: string;
    providerData: object;
    additionalProvidersData: object;
    roles: string[];
    userType: string;
    updated: Date;
    isVerified: boolean;
    resetPasswordToken: string;
    resetPasswordExpires: string;
    verificationToken: string;
}
