import { Module } from '@nestjs/common';
import { GithubRestService } from './github-rest.service';

@Module({
  providers: [GithubRestService],
  exports: [GithubRestService],
})
export class GithubRestModule {}
