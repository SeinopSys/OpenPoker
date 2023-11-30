import { KnownSettings } from '../model/known-settings.enum';
import { isValidTimeZone } from '../../utils/timezone';
import { SettingTypes } from '../entities/user-setting.entity';
import { Logger } from '@nestjs/common';

// TODO Multi-language support
const isValidLanguage = (value: string) => value === 'en';

/**
 * Takes the raw user-supplied setting value and does validation &
 * optionally post-processing before running it through the type guards
 */
export const settingsParser: {
  [k in KnownSettings]: (
    value: unknown,
    logger: Logger,
  ) => SettingTypes[k] | null;
} = {
  [KnownSettings.language]: (value) => {
    if (typeof value !== 'string') return null;

    if (!isValidLanguage(value)) {
      throw new Error('The provided timezone is invalid');
    }

    return value;
  },
};
