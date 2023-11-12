import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from '../../src/entities/projects.entity';
import { Users } from '../../src/entities/users.entity';
import { Comments } from '../../src/entities/comments.entity';
import { Likes } from '../../src/entities/likes.entity';
import { AuthModule } from '../../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from '../../src/config/jwt.config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects, Users, Comments, Likes]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
