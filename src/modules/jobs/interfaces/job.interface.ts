import { Document } from 'mongoose';

/**
 *  Declaring the Interface Job
 */
export interface IJob extends Document {
    created: Date;
    name: string;
    description: string;
    isScheduled: boolean;
    startDate: Date,
    endDate: Date,
    paymentInteral: string;
    isActive: boolean;
    activityId: string;
}
