import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ModuleBController } from './moduleB.controller';
import { DoStuffMiddleware } from '../../common/middlewares/dostuff.middleware';
@Module({
  controllers: [ModuleBController]
})

export class ModuleBModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DoStuffMiddleware)
            .forRoutes({ path: 'moduleB', method: RequestMethod.ALL });
    }
}