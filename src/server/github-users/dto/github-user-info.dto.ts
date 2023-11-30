import type { GithubUser } from '../entities/github-user.entity';

export class GithubUserInfoDto {
  id: number;
  name: string;
  avatarUrl: string;

  private static defaultHash = '00000000000000000000000000000000';

  static from(du: GithubUser): GithubUserInfoDto {
    const dto = new GithubUserInfoDto();
    dto.id = du.id;
    dto.name = du.displayName ?? du.name;
    dto.avatarUrl = GithubUserInfoDto.getAvatarUrl(du);
    return dto;
  }

  private static getAvatarUrl(du: GithubUser) {
    if (du.avatar) {
      return du.avatar;
    }

    // Gravatar logic
    return `https://gravatar.com/avatar/${du.gravatarId ?? GithubUserInfoDto.defaultHash}.png?size=128&d=mp`;
  }
}
