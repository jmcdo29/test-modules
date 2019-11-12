import { Connection } from 'mongoose';
import { ApplicantSchema } from './schemas/applicant.schema';
import { APPLICANT_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const applicantProviders = [{
    provide: APPLICANT_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Applicant', ApplicantSchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
