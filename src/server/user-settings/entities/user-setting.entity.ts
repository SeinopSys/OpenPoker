import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { GithubUser } from '../../github-users/entities/github-user.entity';
import { KnownSettings } from '../model/known-settings.enum';

export interface SettingTypes {
  [KnownSettings.language]: string;
}

export const settingsPrimitiveTypes: Record<
  KnownSettings,
  'string' | 'boolean'
> = {
  [KnownSettings.language]: 'string',
};

export const USER_SETTINGS_SETTING_MAX_LENGTH = 64;

@Entity('user_settings')
export class UserSetting<Setting extends string = string> {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @ManyToOne('GithubUser', (user: GithubUser) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  user: Promise<GithubUser> | GithubUser;

  @Column('character varying', {
    length: USER_SETTINGS_SETTING_MAX_LENGTH,
    nullable: false,
  })
  setting: Setting;

  @Column('json', { nullable: false })
  value: unknown;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  static getDecodedValue<
    Setting extends keyof typeof settingsPrimitiveTypes & string,
  >(setting: UserSetting<Setting>): SettingTypes[Setting] | null {
    if (typeof setting.value === settingsPrimitiveTypes[setting.setting]) {
      return setting.value as never;
    }

    return null;
  }
}
