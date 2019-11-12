import { Connection } from 'mongoose';
import { CategorySchema } from './schemas/category.schema';
import { CATEGORY_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const categoryProviders = [{
    provide: CATEGORY_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Category', CategorySchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
