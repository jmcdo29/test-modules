import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Document Schema Declaration (Before REST communication)
 */

export const documentSchema: ObjectSchema = object({
    name: string().required(),
});
