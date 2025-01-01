import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project-dto';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateProjectDto } from './dto/update-project-dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ProjectMiddleware } from './project.middleware';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  async createProject(
    @CurrentUser() CurrentUser: User,
    req: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (CurrentUser) {
      return this.projectService.createProject(
        createProjectDto,
        CurrentUser.id,
      );
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('')
  @UseGuards(ProjectMiddleware)
  findAllProject() {
    if (CurrentUser) {
      return this.projectService.findAllProject();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('/:id')
  @UseGuards(ProjectMiddleware)
  async updateProject(
    @CurrentUser() CurrentUser: User,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, updateProjectDto, CurrentUser);
  }

  @Delete('/:id')
  @UseGuards(ProjectMiddleware)
  async deleteProject(
    @CurrentUser() CurrentUser: User,
    @Param('id') id: string,
  ) {
    return this.projectService.deleteProject(id, CurrentUser);
  }

  //   @Post(':/projectId/tasks')
  //   async createTask(@Param('/projectId') projectId: string) {
  //     return this.projectService.createTask(projectId);
  //   }
}
