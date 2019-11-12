import { Connection } from 'mongoose';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { SUBSCRIPTION_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES } from '../../server.constants';

export const subscriptionProviders = [{
    provide: SUBSCRIPTION_MODEL_TOKEN,
    useFactory: (connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Subscription', SubscriptionSchema)
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];