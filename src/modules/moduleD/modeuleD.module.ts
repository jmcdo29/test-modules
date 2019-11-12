import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ModuleDController } from './moduleD.controller';
import { DoStuffMiddleware } from '../../common/middlewares/dostuff.middleware';
@Module({
  controllers: [ModuleDController]
})

export class ModuleDModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DoStuffMiddleware)
            .forRoutes({ path: 'moduleD', method: RequestMethod.ALL });
    }
}