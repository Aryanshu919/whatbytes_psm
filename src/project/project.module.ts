import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProjectController],
  providers: [JwtService, ProjectService, PrismaService],
})
export class ProjectModule {}
