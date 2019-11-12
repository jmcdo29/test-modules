import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Category Schema Declaration (Before REST communication)
 */

export const categorySchema: ObjectSchema = object({
    name: string().required(),
    description: string().required()
});
