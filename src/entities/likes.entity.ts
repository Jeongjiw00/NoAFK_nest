import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';
import { Projects } from './projects.entity';

@Entity({ schema: 'noafk', name: 'Likes' })
export class Likes {
  @PrimaryColumn({
    type: 'int',
    unsigned: true,
    name: 'project_id',
    generated: false,
  })
  projectId: number;

  @PrimaryColumn({
    type: 'int',
    unsigned: true,
    name: 'user_id',
    generated: false,
  })
  userId: number;

  /*
    like - user : Many To One
  */
  @ManyToOne(() => Users, (users) => users.Likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  /*
     like - project : Many To One
  */
  @ManyToOne(() => Projects, (projects) => projects.Likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  Projects: Projects;
}
