import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewModule } from './view/view.module';
import { StateModule } from './state/state.module';
import { SharedModule } from './shared.module';
import { RoomCleanupModule } from './room-cleanup/room-cleanup.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GithubUsersModule } from './github-users/github-users.module';
import { GithubRestModule } from './github-rest/github-rest.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [
    AuthModule,
    GithubRestModule,
    GithubUsersModule,
    RoomCleanupModule,
    SharedModule,
    StateModule,
    UsersModule,
    ViewModule,
    UserSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
