import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ModuleAController } from './moduleA.controller';
import { DoStuffMiddleware } from '../../common/middlewares/dostuff.middleware';
@Module({
  controllers: [ModuleAController]
})

export class ModuleAModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(DoStuffMiddleware)
            .forRoutes({ path: 'moduleA', method: RequestMethod.ALL });
    }
}