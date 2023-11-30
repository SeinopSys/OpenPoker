import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { serverEnv } from '../server-env';
import { RoomCleanupQueueData, roomCleanupQueueName } from './room-cleanup.queue';

@Injectable()
export class RoomCleanupService {
  private readonly logger = new Logger(RoomCleanupService.name);

  constructor(
    @InjectQueue(roomCleanupQueueName)
    private readonly rommCleanupQueue: Queue<RoomCleanupQueueData>,
  ) {
    if (serverEnv.LOCAL) {
      void this.clearQueue();
    }
  }

  public queueUpdate(roomId: string) {
    return this.rommCleanupQueue.add({ id: roomId });
  }

  public queueSize() {
    return this.rommCleanupQueue.count();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Processing room cleanup…');

    // TODO

    this.logger.debug('Room cleanup completed successfully');
  }

  /**
   * Clear out existing queue in case any were persisted from the previous run
   */
  private async clearQueue() {
    const queueItems = await this.rommCleanupQueue.count();
    if (queueItems > 0) {
      this.logger.debug(`Clearing existing queue with ${queueItems} item(s)…`);
      await this.rommCleanupQueue.empty();
      this.logger.debug(`Existing queue cleared`);
    } else {
      this.logger.debug(`No existing queue items found`);
    }
  }
}
