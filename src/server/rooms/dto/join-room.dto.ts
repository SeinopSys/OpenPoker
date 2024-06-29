import Joi from 'joi';
import { getRoomPassphraseSchema } from './create-room.dto';

export const joinRoomSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }),
  passphrase: getRoomPassphraseSchema(),
});

export class JoinRoomDto {
  id: string;
  passphrase: string;
}
