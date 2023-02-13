import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;

    if (userId) {
      request.user = await this.usersService.findOne(userId);
    }

    return next.handle();
  }
}
