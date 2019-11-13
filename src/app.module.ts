import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { UsersModule } from './modules/users';
import { ArticlesModule } from './modules/articles';
import { PlansModule } from './modules/plans';
import { SubscriptionsModule } from './modules/subscriptions';
import { CategoriesModule } from './modules/categories';
import { DocumentsModule } from './modules/documents';
import { JobsModule } from './modules/jobs';
import { CompaniesModule } from './modules/companies';
import { MessagesModule } from './modules/messages';
import { ApplicantsModule } from './modules/applicants';

import { AuthModule } from './modules/auth';

//  Database import
import { DatabaseModule } from './database';

//  Gateway sockets
import { AppGateway } from './app.gateway';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TenantMiddleware } from './common/middlewares/tenant.middleware';
import { TokenMiddleware } from './common/middlewares/token.middleware';

import { GlobalVariables } from './global-variables';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ApplicantsModule,
    CompaniesModule,    
    CategoriesModule,
    ArticlesModule,
    JobsModule,
    DocumentsModule,
    UsersModule,
    PlansModule,
    SubscriptionsModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    GlobalVariables
    ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
                .apply(TenantMiddleware, LoggerMiddleware, TokenMiddleware)
                .forRoutes('*');
    }
}
