import { MessageTemplate } from '../entities/message-template.entity';

export class MessageTemplateDto {
  id: string;
  body: string;
  updateFrequency: string;
  /**
   * Timestamp in milliseconds
   */
  lastEditedAt?: number;

  static from(mt: MessageTemplate) {
    const dto = new MessageTemplateDto();
    dto.id = mt.id;
    dto.body = mt.body;
    dto.updateFrequency = mt.updateFrequency;
    dto.lastEditedAt = mt.lastEditedAt?.getTime();
    return dto;
  }
}

export class MessageTemplateListDto {
  templates: MessageTemplateDto[];

  static from(templates: MessageTemplate[]) {
    const dto = new MessageTemplateListDto();
    dto.templates = templates.map((t) => MessageTemplateDto.from(t));
    return dto;
  }
}
