import { Connection } from 'mongoose';
import { PlanSchema } from './schemas/plan.schema';
import { PLAN_MODEL_TOKEN, DB_CONNECTION_TOKEN, DATABASES, TRIAL_DAYS } from '../../server.constants';

export const planProviders = [{
    provide: PLAN_MODEL_TOKEN,
    useFactory: async(connection: Connection) => {
    	for (var i = 0; i < DATABASES.length; i++) {
    		connection[DATABASES[i]].model('Plan', PlanSchema)
    		await createDefaultFreePlan(connection, DATABASES[i]);
    		await createDefaultTrialPlan(connection, DATABASES[i]);
    	}
    },
    inject: [DB_CONNECTION_TOKEN]
}];

async function createDefaultFreePlan(connection, database) {
	console.log(`Creating default free plan for ${database} Database`);
	const Plan = connection[database].model('Plan');
	const freePlan = await Plan.findOne({ name: 'free' });

	if (!freePlan) {
		const plan = new Plan({
			name: 'free',
			measure: 'yearly',
			quantity: 100
		});
		await plan.save();
		console.log('Free Plan Created');
	}
}

async function createDefaultTrialPlan(connection, database) {
	console.log(`Creating default trial plan for ${database} Database`);
	const Plan = connection[database].model('Plan');
	const freePlan = await Plan.findOne({ name: 'trial' });

	if (!freePlan) {
		const plan = new Plan({
			name: 'trial',
			measure: 'daily',
			quantity: TRIAL_DAYS
		});
		await plan.save();
		console.log('Trial Plan Created');
	}
}

