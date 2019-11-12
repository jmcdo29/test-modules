import { object, string, boolean, ObjectSchema, date } from 'joi';

/**
 *  Job Schema Declaration (Before REST communication)
 */

export const jobSchema: ObjectSchema = object({
    name: string().required().label('Job Name is required'),
    description: string().required(),
    isScheduled: boolean().required(),
    starDate: date().required(),
    endDate: date().required(),
    paymentInterval: string().required(),
    isActive: boolean().required(),
    activityId: string().required().label('Please choose the activity related with this job')
});
