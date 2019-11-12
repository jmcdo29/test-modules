import { object, string, boolean, ObjectSchema, array } from 'joi';

/**
 *  Applicant Schema Declaration (Before REST communication)
 */

export const applicantSchema: ObjectSchema = object({
    jobId: string().required(),
    sharedDocuments: array()
});
