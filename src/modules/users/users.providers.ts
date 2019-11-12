import { Connection, createConnection } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';
import { USER_MODEL_TOKEN, DB_CONNECTION_TOKEN, SERVER_CONFIG, DATABASES } from '../../server.constants';

export const userProviders = [{
        provide: USER_MODEL_TOKEN,
        useFactory: (connection: Connection) => {
        	for (var i = 0; i < DATABASES.length; i++) {
				connection[DATABASES[i]].model<IUser>('User', UserSchema);  
				createDbAdmins(connection, DATABASES[i]);      		
        	}
        	//console.log(connection);
        },
        inject: [DB_CONNECTION_TOKEN]
}];

async function createDbAdmins(connection, database) {
	const User = connection[database].model('User');
	let admin = await User.findOne({ email: `admin@${database}.com` });

	if (!admin) {
		const user = new User({
			email: `admin@${database}.com`,
			firstName: 'Admin',
			lastName: database,
			password: 123456,
			provider: 'system',
			roles: 'admin',
			username: 'admin'
		});
		await user.save();
	}
	console.log('Admin created');
}