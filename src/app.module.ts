import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    // isGlobal : 다른 곳에서도 환경변수를 쉽게 불러와 사용하기 위해서
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
