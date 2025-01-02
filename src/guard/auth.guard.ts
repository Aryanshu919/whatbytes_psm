import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    console.log('inside the auth guard');

    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decodedData: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default-secret',
      });
      request.CurrentUser = decodedData;
      return request.CurrentUser;
    } else {
      throw new UnauthorizedException('Not authorized');
    }
  }
}
