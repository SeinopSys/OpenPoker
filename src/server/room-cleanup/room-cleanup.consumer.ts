import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  roomCleanupConcurrency,
  RoomCleanupQueueData,
  roomCleanupQueueName,
} from './room-cleanup.queue';

@Processor(roomCleanupQueueName)
export class RoomCleanupConsumer {
  private readonly logger = new Logger(RoomCleanupConsumer.name);

  constructor() {
  }

  @Process({ concurrency: roomCleanupConcurrency })
  async updateMessage(job: Job<RoomCleanupQueueData>) {
    const jobDataId = job.data.id;
    this.logger.debug(
      `Job ${job.id} updating stale template with ID ${jobDataId}…`,
    );

    // TODO
  }
}
