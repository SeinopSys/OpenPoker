import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { UserRequired } from './user-required.decorator';

@Injectable()
export class SessionUserGuard implements CanActivate {
  logger = new Logger(SessionUserGuard.name);

  constructor(
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userRequired =
      this.reflector.get(UserRequired, context.getHandler()) ?? true;
    const request = context.switchToHttp().getRequest();
    const session = request.handshake?.session || request.session;
    let user: User | null = null;
    let userId: string | undefined;
    if (!session) {
      this.logger.debug('There is no session in request, denying');
      if (userRequired) {
        return false;
      }
    } else {
      userId = session.userId;
      if (!userId) {
        this.logger.debug(
          'Session did not contain userId for request, denying',
        );
        if (userRequired) {
          return false;
        }
      } else {
        // Retrieve user information from the users service
        user = await this.usersService.findOne(userId);
        if (!user) {
          this.logger.debug('User not found for userId in session, denying');
          if (userRequired) {
            return false;
          }
        } else {
          this.logger.debug(
            `User found for userId ${userId} in session, allowing`,
          );
        }
      }
    }

    // Store the user object in the request for later use
    request.user = user;
    return true;
  }
}
