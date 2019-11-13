import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { ApplicantsController } from './applicants.controller';
import { applicantProviders } from './applicants.providers';
import { ApplicantsService } from './applicants.service';

import { ApplicantByIdMiddleware } from './middlewares/applicantById.middleware';
//  Middlewares
import { ApplicantValidatorMiddleware } from './middlewares/applicant-validator.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [ApplicantsController],
    providers: [
        ...applicantProviders,
        ApplicantsService
    ],
    exports: [
        ...applicantProviders
    ]
})
export class ApplicantsModule implements NestModule {
    constructor() {
        console.log('Applicants module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
                .apply(ApplicantValidatorMiddleware)
                .forRoutes({ path: 'applicants', method: RequestMethod.POST });

        consumer
                .apply(ApplicantByIdMiddleware)
                .forRoutes({ path: 'applicants/:applicantId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
