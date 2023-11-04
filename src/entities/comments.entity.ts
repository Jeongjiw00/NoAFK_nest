import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Projects } from './projects.entity';

@Entity({ schema: 'noafk', name: 'Comments' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'comment_id' })
  commentId: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'project_id',
    generated: false,
  })
  projectId: number;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'user_id',
    generated: false,
  })
  userId: number;

  @CreateDateColumn({ nullable: true, name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
  readonly deletedAt: Date | null;

  /*
    comment - project : Many To One
  */
  @ManyToOne(() => Projects, (projects) => projects.Comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  Projects: Projects;

  /*
    comment - user : Many To One
    */
  @ManyToOne(() => Users, (users) => users.Comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;
}
