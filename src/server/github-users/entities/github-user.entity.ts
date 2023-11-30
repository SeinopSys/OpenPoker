import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import { UserSetting } from '../../user-settings/entities/user-setting.entity';

@Entity('github_users')
export class GithubUser {
  /**
   * Represented as string in JS code to avoid losing precision
   */
  @PrimaryColumn('bigint')
  id: number;

  @ManyToOne('User', (user: User) => user.githubUsers)
  user: Promise<User | undefined>;

  @Column('character varying', { length: 32 })
  name: string;

  @Column('character varying', {
    length: 32,
    nullable: true,
  })
  displayName: string | null;

  @Column('character varying', { length: 64, nullable: true })
  avatar: string | null;

  @Column('character varying', { length: 64, nullable: true })
  gravatarId: string | null;

  @Column('character varying', {
    nullable: true,
    default: null,
    length: 128,
  })
  accessToken: string | null;

  @Column('character varying', {
    nullable: true,
    default: null,
    length: 128,
  })
  refreshToken: string | null;

  @Column('character varying', { nullable: true, default: null, length: 128 })
  scopes: string | null;

  @Column('timestamptz', {
    nullable: true,
    default: null,
  })
  tokenExpires: Date | null;

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

  @OneToMany('UserSetting', (userSetting: UserSetting) => userSetting.user, {
    eager: true,
  })
  settings: UserSetting[];
}
