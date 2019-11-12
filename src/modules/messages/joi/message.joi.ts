import { object, string, boolean, ObjectSchema } from 'joi';

/**
 *  Message Schema Declaration (Before REST communication)
 */

export const messageSchema: ObjectSchema = object({
	text: string().required(),
	recipients: string().required(),
	type: string().required()
});
