import { Document } from 'mongoose';

/**
 *  Declaring the Interface Plan
 */
export interface IPlan extends Document {
    created: Date;
    name: string;
    measure: string;
    quantity: string;
    valueInDays: number;
}
