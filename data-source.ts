import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Comments } from 'src/entities/comments.entity';
import { Likes } from 'src/entities/likes.entity';
import { Projects } from 'src/entities/projects.entity';
import { Users } from 'src/entities/users.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  timezone: '+09:00',
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
