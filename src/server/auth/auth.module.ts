import { Module } from '@nestjs/common';
import { GithubRestModule } from '../github-rest/github-rest.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { GithubUsersModule } from '../github-users/github-users.module';
import { GithubStrategy } from './strategies/github.strategy';
import { StateModule } from '../state/state.module';
import { SessionUserGuard } from './guards/session-user.guard';

@Module({
  imports: [
    UsersModule,
    GithubUsersModule,
    PassportModule.register({}),
    HttpModule,
    StateModule,
    GithubRestModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GithubStrategy,
    SessionUserGuard,
  ],
})
export class AuthModule {
}
