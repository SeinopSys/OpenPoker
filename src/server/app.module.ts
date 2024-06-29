import { Module } from '@nestjs/common';
import { OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
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
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    AuthModule,
    GithubRestModule,
    GithubUsersModule,
    RoomCleanupModule,
    SharedModule,
    StateModule,
    UsersModule,
    RoomsModule,
    UserSettingsModule,
    // Add modules that define controllers above ViewController since it has catch-all routes
    ViewModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
