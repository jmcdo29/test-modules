import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { CompaniesController } from './companies.controller';
import { companyProviders } from './companies.providers';
import { CompaniesService } from './companies.service';

import { CompanyByIdMiddleware } from './middlewares/companyById.middleware';
//  Middlewares
import { CompanyValidatorMiddleware } from './middlewares/company-validator.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [CompaniesController],
    providers: [
        ...companyProviders,
        CompaniesService
    ],
    exports: [
        ...companyProviders
    ]
})
export class CompaniesModule implements NestModule {
    constructor() {
        console.log('Companys module loaded');
    }
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CompanyValidatorMiddleware)
            .forRoutes({ path: 'companies', method: RequestMethod.POST });

        consumer.apply(CompanyByIdMiddleware)
            .forRoutes({ path: 'companies/:companyId', method: RequestMethod.ALL });
        //  users id calling middleware for findById users before run another methods like "delete/update/read"
    }
}
