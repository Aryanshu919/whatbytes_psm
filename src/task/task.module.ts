import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma.service';
import { TaskMiddleware } from './task.middleware';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
})
export class TaskModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TaskMiddleware)
      .forRoutes(
        { path: '/projects/:projectId/tasks', method: RequestMethod.POST },
        { path: '/tasks/:id', method: RequestMethod.DELETE },
        { path: '/projects/:projectId/tasks', method: RequestMethod.GET },
        { path: '/tasks/:id', method: RequestMethod.PUT },
      );
  }
}
