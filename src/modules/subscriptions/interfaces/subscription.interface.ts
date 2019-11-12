import { Document } from 'mongoose';

/**
 *  Declaring the Interface Subscription
 */
export interface ISubscription extends Document {
    created: Date;
    userId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
}
