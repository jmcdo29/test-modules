import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Subscription Schema Declaration (Before REST communication)
 */

export const subscriptionSchema: ObjectSchema = object({
    userId: string().required(),
    planId: string().required(),
    startDate: string().required(),
    endDate: string().required()
});
