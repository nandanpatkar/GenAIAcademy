import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StreamMiddleware } from './common/middlewares/stream.middleware';
import { HealthController } from './health.controller';

@Module({
  imports: [SocketModule, ScheduleModule.forRoot()],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StreamMiddleware).forRoutes(AppController);
  }
}
