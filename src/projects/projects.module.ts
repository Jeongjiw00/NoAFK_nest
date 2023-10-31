import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { Users } from 'src/entities/users.entity';
import { Comments } from 'src/entities/comments.entity';
import { Likes } from 'src/entities/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, Users, Comments, Likes])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
