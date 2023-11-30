import { Module } from '@nestjs/common';
import { RoomCleanupService } from './room-cleanup.service';
import { RoomCleanupConsumer } from './room-cleanup.consumer';
import { SharedModule } from '../shared.module';
import { BullModule } from '@nestjs/bull';
import { GithubRestModule } from '../github-rest/github-rest.module';
import { roomCleanupQueueName } from './room-cleanup.queue';
import { UserSettingsModule } from '../user-settings/user-settings.module';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: roomCleanupQueueName,
    }),
    UserSettingsModule,
    GithubRestModule,
  ],
  providers: [RoomCleanupService, RoomCleanupConsumer],
  exports: [RoomCleanupService],
})
export class RoomCleanupModule {
}
