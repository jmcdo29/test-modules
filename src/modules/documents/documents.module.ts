import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { DocumentsController } from './documents.controller';
import { documentProviders } from './documents.providers';
import { DocumentsService } from './documents.service';

import { DocumentByIdMiddleware } from './middlewares/documentById.middleware';
//  Middlewares
import { DocumentValidatorMiddleware } from './middlewares/document-validator.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [DocumentsController],
    providers: [
        ...documentProviders,
        DocumentsService
    ],
    exports: [
        ...documentProviders
    ]
})
export class DocumentsModule implements NestModule {
    constructor() {
        console.log('Documents module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
            consumer
                .apply(DocumentValidatorMiddleware)
                .forRoutes({ path: 'documents', method: RequestMethod.POST });

            consumer.apply(DocumentByIdMiddleware)
                .forRoutes({ path: 'documents/:documentId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"            

    }
}
;