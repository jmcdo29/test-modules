import { Connection } from 'mongoose';
import { MessageSchema } from './schemas/message.schema';
import { MESSAGE_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const messageProviders = [{
    provide: MESSAGE_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Message', MessageSchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
