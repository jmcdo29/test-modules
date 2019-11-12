import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { JobsController } from './jobs.controller';
import { jobProviders } from './jobs.providers';
import { JobsService } from './jobs.service';

import { JobByIdMiddleware } from './middlewares/jobById.middleware';
//  Middlewares
import { JobValidatorMiddleware } from './middlewares/job-validator.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [JobsController],
    providers: [
        ...jobProviders,
        JobsService
    ],
    exports: [
        ...jobProviders
    ]
})
export class JobsModule implements NestModule {
    constructor() {
        console.log('Jobs module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JobValidatorMiddleware)
            .forRoutes({ path: 'jobs', method: RequestMethod.POST });

        consumer.apply(JobByIdMiddleware)
            .forRoutes({ path: 'jobs/:jobId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
