import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

// Added injectable decorator to use Dependency Injection.
// Also, add these interceptor in module providers array
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { userId } = request.session || {};

    if (userId && typeof userId === 'number') {
      // Set currentUser to be consumed by @CurrentUser decorator
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.currentUser = await this.usersService.findOne(userId);
    }

    return next.handle();
  }
}
