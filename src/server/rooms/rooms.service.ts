import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { base64ToArrayBuffer } from '../utils/crypto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRoomDto: CreateRoomDto, owner: User): Promise<Room> {
    const room = new Room();
    room.name = Buffer.from(base64ToArrayBuffer(createRoomDto.name));
    room.passphrase = Buffer.from(
      base64ToArrayBuffer(createRoomDto.passphrase),
    );
    room.owner = owner;

    await this.roomRepository.save(room);

    return room;
  }

  findOne(id: string) {
    return this.roomRepository.findOneBy({ id });
  }

  async update(room: Room, updateRoomDto: UpdateRoomDto) {
    if (!room) throw new NotFoundException();
    if (updateRoomDto.name) {
      room.name = Buffer.from(base64ToArrayBuffer(updateRoomDto.name));
    }
    await this.roomRepository.save(room);
    return room;
  }

  async delete(room: Room) {
    return await this.roomRepository.remove(room);
  }
}
