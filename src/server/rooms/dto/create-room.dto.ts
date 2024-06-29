import Joi from 'joi';

export const ROOM_NAME_MAX_LENGTH = 128;
export const getRoomNameSchema = () =>
  Joi.string().min(1).max(ROOM_NAME_MAX_LENGTH);

export const ROOM_PASSPHRASE_MAX_LENGTH = 256;
export const getRoomPassphraseSchema = () =>
  Joi.string().min(1).max(ROOM_PASSPHRASE_MAX_LENGTH);

export const createRoomSchema = Joi.object({
  name: getRoomNameSchema(),
  passphrase: getRoomPassphraseSchema(),
});

export class CreateRoomDto {
  name: string;
  passphrase: string;
}
