import { UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SessionUserGuard } from '../auth/guards/session-user.guard';
import { JoiValidationPipe } from '../joi-validation/joi-validation.pipe';
import { User } from '../users/entities/user.entity';
import {
  arrayBufferToHex,
  base64ToArrayBuffer,
  passwordVerify,
} from '../utils/crypto';
import { CreateRoomDto, createRoomSchema } from './dto/create-room.dto';
import { JoinRoomDto, joinRoomSchema } from './dto/join-room.dto';
import { LeaveRoomDto, leaveRoomSchema } from './dto/leave-room.dto';
import { createRoomInfoDto } from './dto/room-info.dto';
import { RoomsService } from './rooms.service';

@WebSocketGateway()
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(SessionUserGuard)
  @Throttle({ default: { limit: 3, ttl: 3600e3 } })
  @UsePipes(new JoiValidationPipe(createRoomSchema))
  @SubscribeMessage('rooms.create')
  async create(client: Socket, data: CreateRoomDto) {
    const owner = (client as unknown as { user: User | undefined }).user;
    if (!owner) {
      return new UnauthorizedException();
    }
    const room = await this.roomsService.create(data, owner);
    return createRoomInfoDto(room);
  }

  @UseGuards(SessionUserGuard)
  @Throttle({ default: { limit: 120, ttl: 3600e3 } })
  @UsePipes(new JoiValidationPipe(joinRoomSchema))
  @SubscribeMessage('rooms.join')
  async join(
    client: Socket,
    data: JoinRoomDto,
  ): Promise<WsResponse | undefined> {
    const room = await this.roomsService.findOne(data.id);
    if (!room) {
      return;
    }

    const userSuppliedPassphrase = arrayBufferToHex(
      base64ToArrayBuffer(data.passphrase),
    );
    const roomPassphrase = arrayBufferToHex(room.passphrase);

    const isValid = passwordVerify(userSuppliedPassphrase, roomPassphrase);
    if (!isValid) {
      return;
    }

    client.join(room.id);
    return { event: 'rooms.joined', data: room.id };
  }

  @UseGuards(SessionUserGuard)
  @Throttle({ default: { limit: 300, ttl: 3600e3 } })
  @UsePipes(new JoiValidationPipe(leaveRoomSchema))
  @SubscribeMessage('rooms.leave')
  async leave(
    client: Socket,
    data: LeaveRoomDto,
  ): Promise<WsResponse | undefined> {
    const roomId = data.id;
    if (!client.rooms.has(roomId)) {
      client.leave(roomId);
    }

    return { event: 'rooms.left', data: roomId };
  }

  /*
  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody() id: string) {
    return this.roomsService.findOne(id);
  }

  @SubscribeMessage('updateRoom')
  update(@MessageBody() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto.id, updateRoomDto);
  }

  @SubscribeMessage('removeRoom')
  remove(@MessageBody() id: number) {
    return this.roomsService.remove(id);
  }
  */
}
