import { Connection } from 'mongoose';
import { DocumentSchema } from './schemas/document.schema';
import { DOCUMENT_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const documentProviders = [{
    provide: DOCUMENT_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Document', DocumentSchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
