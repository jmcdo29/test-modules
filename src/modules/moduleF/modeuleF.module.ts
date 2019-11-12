import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ModuleFController } from './moduleF.controller';
import { DoStuffMiddleware } from '../../common/middlewares/dostuff.middleware';
@Module({
  controllers: [ModuleFController]
})

export class ModuleFModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DoStuffMiddleware)
            .forRoutes({ path: 'moduleF', method: RequestMethod.ALL });
    }
}