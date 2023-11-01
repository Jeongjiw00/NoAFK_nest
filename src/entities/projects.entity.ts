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

  /*
      project - user : Many To One
  */
  @ManyToOne(() => Users, (users) => users.Projects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  @Column({ type: 'int', unsigned: true, name: 'user_id' })
  userId: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @Column({ type: 'boolean', nullable: false, default: 0 })
  status: boolean;

  @Column('int', { nullable: false, default: 0 })
  view: number;

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  readonly updatedAt: Date;

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
