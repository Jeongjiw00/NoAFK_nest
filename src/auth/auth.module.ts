import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from '../../src/config/jwt.config.service';
import { Users } from '../../src/entities/users.entity';
import { Comments } from '../../src/entities/comments.entity';
import { Likes } from '../../src/entities/likes.entity';
import { Projects } from '../../src/entities/projects.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Comments, Projects, Likes]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
