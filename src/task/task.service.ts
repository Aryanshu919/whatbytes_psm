import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    projectId: string,
    createTaskDto: CreateTaskDto,
    userId: string,
  ) {
    const { assignedUserId, ...data } = createTaskDto;
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    if (project.userId === userId) {
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

  async getTasksByProjectId(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    if (project.userId === userId) {
      return this.prisma.task.findMany({
        where: { projectId },
      });
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (project.userId === userId) {
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
    return {
      msg: 'You can only delete your own data',
    };
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    const project = await this.prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (project.userId === userId) {
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
}
