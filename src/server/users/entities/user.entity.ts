import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Room } from '../../rooms/entities/room.entity';
import { USER_NAME_MAX_LENGTH } from '../dto/create-user.dto';
import type { GithubUser } from '../../github-users/entities/github-user.entity';

@Entity('users')
export class User {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('character varying', { length: USER_NAME_MAX_LENGTH })
  name: string;

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

  @OneToMany('GithubUser', (githubUser: GithubUser) => githubUser.user, {
    eager: true,
  })
  githubUsers: GithubUser[];

  @OneToMany('Room', (room: Room) => room.owner, {
    eager: true,
  })
  rooms: Room[];
}
