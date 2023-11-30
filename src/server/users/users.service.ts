import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubUser } from '../github-users/entities/github-user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  async create(createUserDto: CreateUserDto, save = true) {
    let user = new User();
    user.name = createUserDto.name;
    if (save) {
      user = await this.userRepository.save(user);
    }
    return user;
  }

  async createForGithubUser(githubUser: GithubUser): Promise<GithubUser> {
    this.logger.debug(
      `Creating new local user for GitHub user (${githubUser.id})…`,
    );
    let appUser = await this.create(
      {
        name: githubUser.name,
      },
      true,
    );

    this.logger.debug(
      `Linking GitHub user (${githubUser.id}) to new user (${appUser.id})…`,
    );
    githubUser.user = Promise.resolve(appUser);
    return githubUser;
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    return this.userRepository.save(user);
  }

  remove(user: User) {
    return this.userRepository.remove(user);
  }
}
