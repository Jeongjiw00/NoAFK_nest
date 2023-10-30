import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Projects } from './projects.entity';
import { Likes } from './likes.entity';

@Entity({ schema: 'noafk', name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'user_id' })
  userId: number;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  nickname: string;

  @Column('varchar', { nullable: true, name: 'profile_img' })
  profileImg: string;

  @Column('varchar', { nullable: true })
  introduction: string;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  authLevel: number;

  @CreateDateColumn({ nullable: true, name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
  readonly deletedAt: Date | null;

  /*
      user - comment : One To Many
  */
  @OneToMany(() => Comments, (comments) => comments.Users)
  Comments: Comments[];

  /*
      user - project : One To Many
  */
  @OneToMany(() => Projects, (projects) => projects.Users)
  Projects: Projects[];

  /*
      user - like : One To Many
  */
  @OneToMany(() => Likes, (likes) => likes.Users, {
    onDelete: 'CASCADE',
  })
  Likes: Likes[];
}
