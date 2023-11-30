import type { User } from '../entities/user.entity';
import { GithubUserInfoDto } from '../../github-users/dto/github-user-info.dto';

export class UserInfoDto {
  id: string;
  name: string;
  githubUsers: GithubUserInfoDto[];
  maxTemplates: number;

  static from(user: User): UserInfoDto {
    const dto = new UserInfoDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.githubUsers = user.githubUsers.map((gu) =>
      GithubUserInfoDto.from(gu),
    );
    dto.maxTemplates = user.getMaxTemplateCount();
    return dto;
  }
}
