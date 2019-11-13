import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { SubscriptionsController } from './subscriptions.controller';
import { subscriptionProviders } from './subscriptions.providers';

import { SubscriptionsService } from './subscriptions.service';

import { SubscriptionByIdMiddleware } from './middlewares/subscriptionById.middleware';
//  Middlewares
import { SubscriptionValidatorMiddleware } from './middlewares/subscription-validator.middleware';

import { PlansService } from '../plans/plans.service';

@Module({
    imports: [DatabaseModule],
    controllers: [SubscriptionsController],
    providers: [
        ...subscriptionProviders,
        SubscriptionsService,
        PlansService
    ],
    exports: [
        ...subscriptionProviders
    ]
})
export class SubscriptionsModule implements NestModule {
    constructor() {
        console.log('Subscriptions module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
                .apply(SubscriptionValidatorMiddleware)
                .forRoutes({ path: 'subscriptions', method: RequestMethod.POST });

        consumer.apply(SubscriptionByIdMiddleware)
                .forRoutes({ path: 'subscriptions/:subscriptionId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
