import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { PrismaService } from 'src/prisma.service';
// import { UserMiddleware } from './user.middleware';

// @Module({
//   controllers: [UserController],
//   providers: [UserService, PrismaService],
// })
// export class UserModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(UserMiddleware)
//       .forRoutes(
//         { path: 'users/:id', method: RequestMethod.PUT },
//         { path: 'users/:id', method: RequestMethod.DELETE },
//         { path: 'users', method: RequestMethod.GET },
//       );
//   }
// }

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
import { ProjectService } from 'src/project/project.service';
import { ProjectController } from 'src/project/project.controller';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthGuard,
    ProjectService,
    UserService,
    JwtStrategy,
    PrismaService,
  ],
  controllers: [UserController, ProjectController],
})
export class UserModule {}
