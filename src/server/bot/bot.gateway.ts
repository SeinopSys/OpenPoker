import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Client, Events, Message } from 'discord.js';
import { CollectorInterceptor } from '@discord-nestjs/common';
import { MessageTemplate } from '../message-templates/entities/message-template.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly entityManager: EntityManager,
  ) {}

  @Once(Events.ClientReady)
  onReady() {
    this.logger.log(`Bot ${this.client.user?.tag} was started!`);
  }

  // TODO Also perform cleanup on application startup
  @On(Events.MessageDelete)
  @UseInterceptors(CollectorInterceptor)
  async onMessageDelete(message: Message) {
    if (!message.guildId || !message.author.bot) {
      return;
    }

    const where = {
      messageId: message.id,
      serverId: message.guildId,
      channelId: message.channelId,
    } satisfies Partial<MessageTemplate>;
    this.logger.debug(
      `Detected bot message deletion (${JSON.stringify(where)})`,
    );

    const existingTemplate = await this.entityManager.findOne(MessageTemplate, {
      where,
    });
    if (!existingTemplate) {
      this.logger.debug(
        `No templates found for deleted message ${JSON.stringify(where)})`,
      );
      return;
    }
    const existingTemplateId = existingTemplate.id;

    this.logger.log(
      `Found template with ID ${existingTemplateId} for a deleted message, cleaning up…`,
    );
    await this.entityManager.remove(existingTemplate);
    this.logger.log(`Template ${existingTemplateId} cleaned up successfully`);
  }
}
