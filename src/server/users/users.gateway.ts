import { Req, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Request } from 'express';
import { SessionUserGuard } from '../auth/guards/session-user.guard';
import { UserRequired } from '../auth/guards/user-required.decorator';
import { UserInfoDto } from './dto/user-info.dto';

@WebSocketGateway()
export class UsersGateway {
  @SubscribeMessage('users.findMe')
  @UseGuards(SessionUserGuard)
  @UserRequired(false)
  findMe(@Req() req: Request): UserInfoDto | null {
    const user = req.user;
    if (!user) {
      return null;
    }
    return UserInfoDto.from(user);
  }
}
