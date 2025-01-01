import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { User } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(createProjectDto: CreateProjectDto, id: string) {
    const { userId, ...data } = createProjectDto;
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    return this.prisma.project.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  async findAllProject() {
    console.log('inside findall project');
    return this.prisma.project.findMany();
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
    CurrentUser: User,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    if (project.userId === CurrentUser.id) {
      return this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });
    }
    return {
      msg: "'You can only update your own data'",
    };
  }

  async deleteProject(id: string, CurrentUser: User) {
    console.log('inside deleteproject');
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId === CurrentUser.id) {
      return this.prisma.project.delete({
        where: { id },
      });
    }
    return {
      msg: "'You can only delete your own data'",
    };
  }
  async findById(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
