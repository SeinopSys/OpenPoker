import { PartialType } from '@nestjs/swagger';
import { CreateGithubUserDto } from './create-github-user.dto';

export class UpdateGithubUserDto extends PartialType(CreateGithubUserDto) {
  id?: never;
}
