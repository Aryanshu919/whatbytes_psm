import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [JwtService, TaskService, PrismaService],
})
// export class TaskModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TaskMiddleware)
//       .forRoutes(
//         { path: '/projects/:projectId/tasks', method: RequestMethod.POST },
//         { path: '/tasks/:id', method: RequestMethod.DELETE },
//         { path: '/projects/:projectId/tasks', method: RequestMethod.GET },
//         { path: '/tasks/:id', method: RequestMethod.PUT },
//       );
//   }
// }
export class TaskModule {}
