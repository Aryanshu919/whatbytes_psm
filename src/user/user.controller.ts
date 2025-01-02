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
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUserDTO } from 'src/utility/dto/current-user-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() req) {
    return this.userService.login(req);
  }

  @Post('')
  async register(@Body() req) {
    return this.userService.register(req.email, req.password, req.name);
  }

  @Get('')
  @UseGuards(AuthGuard)
  findAllUser(@Req() req) {
    const userId = req.CurrentUser.sub;
    console.log('logging current userId', userId);

    if (userId) {
      return this.userService.findAllUser();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Req() req,
    @Param('id') id: string,
    @Body() userData: CurrentUserDTO,
  ): Promise<object> {
    const userId = req.CurrentUser.sub;
    return this.userService.updateUser(id, userData, userId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Req() req, @Param('id') id: string): Promise<object> {
    const userId = req.CurrentUser.sub;
    return this.userService.deleteUser(id, userId);
  }
}
