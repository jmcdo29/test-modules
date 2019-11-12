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
import { ModuleAModule } from './modules/moduleA/modeuleA.module';
import { ModuleBModule } from './modules/moduleB/modeuleB.module';
import { ModuleCModule } from './modules/moduleC/modeuleC.module';
import { ModuleDModule } from './modules/moduleD/modeuleD.module';
import { ModuleEModule } from './modules/moduleE/modeuleE.module';
import { ModuleFModule } from './modules/moduleF/modeuleF.module';
import { ModuleGModule } from './modules/moduleG/modeuleG.module';
import { ModuleHModule } from './modules/moduleH/modeuleH.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ApplicantsModule,
    CategoriesModule,
    CompaniesModule,
    ArticlesModule,
    JobsModule,
    DocumentsModule,
    UsersModule,
    PlansModule,
    ModuleAModule,
    SubscriptionsModule,
    MessagesModule,    
    ModuleBModule,
    ModuleCModule,
    ModuleDModule,
    ModuleEModule,
    ModuleFModule,
    ModuleGModule,
    ModuleHModule
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
