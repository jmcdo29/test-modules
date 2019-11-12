import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Company Schema Declaration (Before REST communication)
 */

export const companySchema: ObjectSchema = object({
    name: string().required(),
    address: string().required(),
    userId: string().required()
});
