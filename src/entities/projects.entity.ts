import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Users } from './users.entity';
import { Likes } from './likes.entity';

@Entity({ schema: 'noafk', name: 'Projects' })
export class Projects {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'project_id' })
  projectId: number;

  @Column({ type: 'int', unsigned: true, name: 'user_id' })
  userId: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

  @Column('int', { nullable: true, default: 0 })
  view: number;

  @CreateDateColumn({ nullable: true, name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
  readonly deletedAt: Date | null;

  /*
      project - user : Many To One
  */
  @ManyToOne(() => Users, (users) => users.Projects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  /*
      project - comment : One To Many
  */
  @OneToMany(() => Comments, (comments) => comments.Projects)
  Comments: Comments[];

  /*
      project - like : One To Many
  */
  @OneToMany(() => Likes, (likes) => likes.Projects, {
    onDelete: 'CASCADE',
  })
  Likes: Likes[];
}
