import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GithubUser } from './entities/github-user.entity';
import { CreateGithubUserDto } from './dto/create-github-user.dto';
import { UpdateGithubUserDto } from './dto/update-github-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GithubUsersService {
  constructor(
    @InjectRepository(GithubUser)
    private readonly githubUserRepository: Repository<GithubUser>,
  ) {
  }

  async create(createDto: CreateGithubUserDto, save = true) {
    const githubUser = new GithubUser();
    githubUser.id = createDto.id;
    githubUser.name = createDto.name;
    githubUser.avatar = createDto.avatar;
    githubUser.gravatarId = createDto.gravatarId;
    if (save) {
      await this.githubUserRepository.save(githubUser);
    }
    return githubUser;
  }

  async findOne(id: number) {
    return this.githubUserRepository.findOneBy({ id });
  }

  async delete(id: number) {
    await this.githubUserRepository.delete({ id });
  }

  async update(
    idOrInstance: number | GithubUser,
    updateDto: UpdateGithubUserDto,
  ) {
    const githubUser =
      typeof idOrInstance === 'number'
        ? await this.findOne(idOrInstance)
        : idOrInstance;

    if (!githubUser) {
      throw new NotFoundException();
    }

    if (updateDto.name) {
      githubUser.name = updateDto.name;
    }
    if (updateDto.avatar) {
      githubUser.avatar = updateDto.avatar;
    }
    if (updateDto.gravatarId) {
      githubUser.gravatarId = updateDto.gravatarId;
    }
    if (updateDto.accessToken) {
      githubUser.accessToken = updateDto.accessToken;
    }
    if (updateDto.refreshToken) {
      githubUser.refreshToken = updateDto.refreshToken;
    }
    if (updateDto.scopes) {
      githubUser.scopes = updateDto.scopes;
    }
    await this.githubUserRepository.save(githubUser);
    return githubUser;
  }
}
