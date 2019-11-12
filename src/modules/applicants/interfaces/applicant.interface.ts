import { Document } from 'mongoose';

/**
 *  Declaring the Interface Applicant
 */
export interface IApplicant extends Document {
	_id: string;
	jodId: string;
	userId: string;
	applicationDate: Date;
	sharedDocuments: [string];
    created: Date;
}
