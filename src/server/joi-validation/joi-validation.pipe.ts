import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { Socket } from 'socket.io';

/**
 * @see https://docs.nestjs.com/pipes#object-schema-validation
 */
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    if (value instanceof Socket) {
      return value;
    }
    const { error } = this.schema.validate(value, {
      convert: true,
      stripUnknown: true,
    });
    if (error) {
      throw new BadRequestException(
        `Validation failed:\n${error.annotate(true)}`,
      );
    }
    return value;
  }
}
