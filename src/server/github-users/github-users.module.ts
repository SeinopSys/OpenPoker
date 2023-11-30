import { Module } from '@nestjs/common';
import { GithubUsersService } from './github-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubUser } from './entities/github-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GithubUser])],
  controllers: [],
  providers: [GithubUsersService],
  exports: [GithubUsersService],
})
export class GithubUsersModule {
  constructor(private readonly service: GithubUsersService) {
  }

  findOne(id: number) {
    return this.service.findOne(id);
  }
}
