import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { User } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    projectId: string,
    createTaskDto: CreateTaskDto,
    CurrentUser: User,
  ) {
    const { assignedUserId, ...data } = createTaskDto;
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    if (project.userId === CurrentUser.id) {
      if (assignedUserId) {
        const user = await this.prisma.user.findUnique({
          where: { id: assignedUserId },
        });
        if (!user) {
          throw new NotFoundException(
            `User with ID ${assignedUserId} not found.`,
          );
        }
      }

      return this.prisma.task.create({
        data: {
          ...data,
          projectId,
          assignedUserId,
        },
      });
    }
  }

  async getTasksByProjectId(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    if (updateTaskDto.assignedUserId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.assignedUserId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateTaskDto.assignedUserId} not found.`,
        );
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: string, CurrentUser: User) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    const project = await this.prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (project.userId === CurrentUser.id) {
      return this.prisma.task.delete({
        where: { id },
      });
    }
  }

  async getFilteredTasks(status?: string, assignedUserId?: string) {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (assignedUserId) {
      filter.assignedUserId = assignedUserId;
    }
    return this.prisma.task.findMany({
      where: filter,
    });
  }

  async findById(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
