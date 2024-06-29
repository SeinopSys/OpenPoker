import Joi from 'joi';

export const leaveRoomSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }),
});

export class LeaveRoomDto {
  id: string;
}
