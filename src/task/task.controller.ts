import {
  Controller,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Get,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskMiddleware } from './task.middleware';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('projects/:projectId/tasks')
  @UseGuards(TaskMiddleware)
  async createTask(
    @CurrentUser() CurrentUser: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.createTask(projectId, createTaskDto, CurrentUser);
  }

  @Get('projects/:projectId/tasks')
  @UseGuards(TaskMiddleware)
  async getTasks(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.getTasksByProjectId(projectId);
  }

  @Put('/tasks/:id')
  @UseGuards(TaskMiddleware)
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete('/tasks/:id')
  @UseGuards(TaskMiddleware)
  async deleteTask(
    @CurrentUser() CurrentUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.deleteTask(id, CurrentUser);
  }

  @Get('/tasks')
  async getFilteredTasks(
    @Query('status') status?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.taskService.getFilteredTasks(status, assignedUserId);
  }
}
