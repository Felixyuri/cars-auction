import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('JWT token is missing.');
    }

    try {
    const decodedToken = this.jwtService.verify(token, {secret: process.env.SECRET_KEY});

      request.user = decodedToken;

      return true;
    } catch (error) {
        throw new UnauthorizedException('JWT token is invalid.');
    }
  }
}
