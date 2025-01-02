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
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('projects/:projectId/tasks')
  @UseGuards(AuthGuard)
  async createTask(
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = req.CurrentUser.sub;
    return this.taskService.createTask(projectId, createTaskDto, userId);
  }

  @Get('projects/:projectId/tasks')
  @UseGuards(AuthGuard)
  async getTasks(
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const uersId = req.CurrentUser.sub;
    return this.taskService.getTasksByProjectId(projectId, uersId);
  }

  @Put('/tasks/:id')
  @UseGuards(AuthGuard)
  async updateTask(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.CurrentUser.sub;
    return this.taskService.updateTask(id, updateTaskDto, userId);
  }

  @Delete('/tasks/:id')
  @UseGuards(AuthGuard)
  async deleteTask(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.CurrentUser.sub;
    return this.taskService.deleteTask(id, userId);
  }

  @Get('/tasks')
  async getFilteredTasks(
    @Query('status') status?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.taskService.getFilteredTasks(status, assignedUserId);
  }
}
