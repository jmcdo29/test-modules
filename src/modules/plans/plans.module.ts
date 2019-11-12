import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { PlansController } from './plans.controller';
import { planProviders } from './plans.providers';
import { PlansService } from './plans.service';

import { PlanByIdMiddleware } from './middlewares/planById.middleware';
//  Middlewares
import { PlanValidatorMiddleware } from './middlewares/plan-validator.middleware';


@Module({
    imports: [DatabaseModule],
    controllers: [PlansController],
    providers: [
        ...planProviders,
        PlansService
    ],
    exports: [
        ...planProviders
    ]
})
export class PlansModule implements NestModule {
    constructor() {
        console.log('Plans module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(PlanValidatorMiddleware)
            .forRoutes({ path: 'plans', method: RequestMethod.POST });

        consumer.apply(PlanByIdMiddleware)
            .forRoutes({ path: 'plans/:planId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
