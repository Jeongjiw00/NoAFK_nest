import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { JwtConfigService } from './config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // isGlobal : 다른 곳에서도 환경변수를 쉽게 불러와 사용하기 위해서
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    ProjectsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
