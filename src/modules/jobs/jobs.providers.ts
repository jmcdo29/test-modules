import { Connection } from 'mongoose';
import { JobSchema } from './schemas/job.schema';
import { JOB_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const jobProviders = [{
    provide: JOB_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Job', JobSchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];
