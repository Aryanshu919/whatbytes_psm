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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project-dto';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project-dto';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Post('')
  async createProject(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.CurrentUser.sub;
    console.log('inside createProject routes logging userId', userId);
    if (userId) {
      return this.projectService.createProject(createProjectDto, userId);
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(AuthGuard)
  @Get('')
  findAllProject(@Req() req) {
    const userId = req.CurrentUser.sub;
    console.log('inside createProject routes logging userId', userId);
    if (userId) {
      return this.projectService.findAllProject();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateProject(
    @Req() req,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const userId = req.CurrentUser.sub;
    return this.projectService.updateProject(id, updateProjectDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  // @UseGuards(ProjectMiddleware)
  async deleteProject(@Req() req, @Param('id') id: string) {
    const userId = req.CurrentUser.sub;
    return this.projectService.deleteProject(id, userId);
  }

  //   @Post(':/projectId/tasks')
  //   async createTask(@Param('/projectId') projectId: string) {
  //     return this.projectService.createTask(projectId);
  //   }
}
