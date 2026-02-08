import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  interface Express {
    Request: {
      currentUser?: User | null;
    };
  }
}

/** Interceptors are executed after the Guards. Now to determine whether the current user is
 * Admin in the approve report route handler, we need to create a middleware with current user
 * information from the session object to be consumed by the AdminGuard */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { userId } = req?.session || {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (userId && !isNaN(parseInt(userId))) {
      const user = await this.usersService.findOne(+userId);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.currentUser = user;
    }

    next();
  }
}
