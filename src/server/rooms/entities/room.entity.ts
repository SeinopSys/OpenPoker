import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';

@Entity('rooms')
export class Room {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('bytea')
  name: Buffer;

  @Column('bytea')
  passphrase: Buffer;

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

  @ManyToOne('User', (user: User) => user.rooms)
  owner: User | Promise<User>;
}
