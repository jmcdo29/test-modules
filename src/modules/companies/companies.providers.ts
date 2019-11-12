import { Connection } from 'mongoose';
import { CompanySchema } from './schemas/company.schema';
import { COMPANY_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const companyProviders = [{
    provide: COMPANY_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Company', CompanySchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
