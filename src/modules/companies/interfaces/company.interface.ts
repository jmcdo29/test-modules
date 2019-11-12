import { Document } from 'mongoose';

/**
 *  Declaring the Interface Company
 */
export interface ICompany extends Document {
    created: Date;
    name: string;
    description: string;
    address: string;
    userId: string;
}
