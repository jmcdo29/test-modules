import { connect, createConnection, set } from 'mongoose';
import { SERVER_CONFIG, DB_CONNECTION_TOKEN, DATABASES } from '../server.constants';

const opts = {
    useNewUrlParser: true,
    keepAlive: true,
    socketTimeoutMS: 30000,
    poolSize: 100,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    autoReconnect: true,
    useUnifiedTopology: true
};

export const databaseProviders = [{
    provide: DB_CONNECTION_TOKEN,
    useFactory: async () => {
        try {
            let connections = {};
            console.log(`Connecting to ${SERVER_CONFIG.db_uri}`);
            set('useCreateIndex', true);
            for (var i = 0; i < DATABASES.length; i++) {
                console.log('-------------- CREATE CONNECTION BEGIN-----------------');
                connections[DATABASES[i]] = await createConnection(`${SERVER_CONFIG.db_host}/${DATABASES[i]}`, opts);
                console.log('-------------- CREATE CONNECTION END-----------------');
            }
            return connections;
        } catch (ex) {
            console.log(ex);
        }
    }
}];