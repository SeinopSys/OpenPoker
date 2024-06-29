import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionUserGuard } from '../auth/guards/session-user.guard';
import { createRoomInfoDto, RoomInfoDto } from './dto/room-info.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':id')
  @UseGuards(SessionUserGuard)
  async findOne(
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Temporarily ignored
    @Req() req: Request,
  ): Promise<RoomInfoDto | null> {
    const room = await this.roomsService.findOne(id);
    if (!room) {
      throw new NotFoundException();
    }
    return createRoomInfoDto(room);
  }
}
