import { Reflector } from '@nestjs/core';

export const UserRequired = Reflector.createDecorator<boolean>();
