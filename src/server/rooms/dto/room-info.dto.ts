import { arrayBufferToBase64 } from '../../utils/crypto';
import { Room } from '../entities/room.entity';

export class RoomInfoDto {
  id: string;
  name: string;
}

export const createRoomInfoDto = (room: Room): RoomInfoDto => {
  const dto = new RoomInfoDto();
  dto.id = room.id;
  dto.name = arrayBufferToBase64(room.name);
  return dto;
};
