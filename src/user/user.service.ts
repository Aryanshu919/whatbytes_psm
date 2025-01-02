import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CurrentUserDTO } from 'src/utility/dto/current-user-dto';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const data = await this.validateUser(user.email, user.password);
    if (!data) {
      return {
        msg: 'no user found',
      };
    }
    if (data === null) {
      return {
        msg: 'password is incorrect',
      };
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, pass: string, name: string) {
    const useremail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (useremail) {
      return {
        msg: 'User already Exists',
      };
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    // return result;
    const payload = { email: result.email, sub: result.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async findAllUser() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { email, name, password } = userData;

    return await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
  }

  async updateUser(id: string, userData: CurrentUserDTO, userId: string) {
    console.log('userData', userData);
    console.log('userId', userId);
    if (userId === id) {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: userData,
        select: {
          name: true,
          id: true,
          email: true,
          createdAt: true,
        },
      });
      console.log('updating the user', updatedUser);
      return {
        sucess: true,
        data: updatedUser,
      };
    } else {
      throw new HttpException(
        'You can only update your own data',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteUser(id: string, userId: string) {
    console.log('inside deleteUser', userId);
    if (userId === id) {
      const userData = await this.prisma.user.delete({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        message: 'User Deleted',
        data: userData,
      };
    } else {
      throw new HttpException(
        'You can only delete your own data',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
