import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      req.user = await this.usersService.findOne(userId);
    }

    next();
  }
}
