import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Plan Schema Declaration (Before REST communication)
 */

export const planSchema: ObjectSchema = object({
    name: string().required(),
    measure: string().required(),
    quantity: string().required(),
});
