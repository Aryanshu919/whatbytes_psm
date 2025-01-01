import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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

  async updateUser(id: string, userData: User, CurrentUser: User) {
    const userId = CurrentUser.id;
    if (userId === id) {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: userData,
      });
    } else {
      throw new HttpException(
        'You can only update your own data',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteUser(id: string, CurrentUser: User) {
    const userId = CurrentUser.id;
    if (userId === id) {
      return await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } else {
      throw new HttpException(
        'You can only delete your own data',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findById(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
