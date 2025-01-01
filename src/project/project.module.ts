import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectMiddleware } from './project.middleware';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService],
})
export class ProjectModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectMiddleware)
      .forRoutes(
        { path: 'projects/:id', method: RequestMethod.PUT },
        { path: 'projects/:id', method: RequestMethod.DELETE },
        { path: 'projects/', method: RequestMethod.POST },
        { path: 'projects/', method: RequestMethod.GET },
      );
  }
}
