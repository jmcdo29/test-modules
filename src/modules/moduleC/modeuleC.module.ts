import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ModuleCController } from './moduleC.controller';
import { DoStuffMiddleware } from '../../common/middlewares/dostuff.middleware';
@Module({
  controllers: [ModuleCController]
})

export class ModuleCModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DoStuffMiddleware)
            .forRoutes({ path: 'moduleC', method: RequestMethod.ALL });
    }
}