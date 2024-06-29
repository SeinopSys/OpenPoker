import { GithubUserInfoDto } from '../../github-users/dto/github-user-info.dto';
import type { User } from '../entities/user.entity';

export class UserInfoDto {
  id: string;
  name: string;
  githubUsers: GithubUserInfoDto[];

  static from(user: User): UserInfoDto {
    const dto = new UserInfoDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.githubUsers = user.githubUsers.map((gu) => GithubUserInfoDto.from(gu));
    return dto;
  }
}
