import Joi from 'joi';

export const createGithubUserSchema = Joi.object({
  id: Joi.number().min(1),
  name: Joi.string().min(1).max(60),
  displayName: Joi.string().min(4).max(60).allow(null),
  avatar: Joi.string().max(128).allow(null),
  gravatarId: Joi.string().max(128).allow(null),
});

export class CreateGithubUserDto {
  id: number;
  name: string;
  displayName: string | null;
  avatar: string | null;
  gravatarId: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  scopes?: string | null;
}
