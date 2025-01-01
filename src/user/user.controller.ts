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
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserMiddleware } from './user.middleware';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(UserMiddleware)
  findAllUser(@CurrentUser() CurrentUser: User) {
    if (CurrentUser) {
      return this.userService.findAllUser();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('')
  @UseGuards(UserMiddleware)
  async createUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put('/:id')
  @UseGuards(UserMiddleware)
  async updateUser(
    @CurrentUser() CurrentUser: User,
    @Param('id') id: string,
    @Body() userData: User,
  ): Promise<User> {
    console.log(CurrentUser);
    return this.userService.updateUser(id, userData, CurrentUser);
  }

  @Delete('/:id')
  @UseGuards(UserMiddleware)
  async deleteUser(
    @CurrentUser() CurrentUser: User,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.deleteUser(id, CurrentUser);
  }
}
