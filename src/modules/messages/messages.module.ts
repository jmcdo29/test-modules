import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { MessagesController } from './messages.controller';
import { messageProviders } from './messages.providers';
import { MessagesService } from './messages.service';

import { MessageByIdMiddleware } from './middlewares/messageById.middleware';
//  Middlewares
import { MessageValidatorMiddleware } from './middlewares/message-validator.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [MessagesController],
    providers: [
        ...messageProviders,
        MessagesService
    ],
    exports: [
        ...messageProviders
    ]
})
export class MessagesModule implements NestModule {
    constructor() {
        console.log('Messages module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
                .apply(MessageValidatorMiddleware)
                .forRoutes({ path: 'messages', method: RequestMethod.POST });

        consumer.apply(MessageByIdMiddleware)
                .forRoutes({ path: 'messages/:messageId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
