import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createRedisOptions(): Promise<RedisModuleOptions> {
    return {
      config: {
        host: this.configService.get<string>('REDIS_HOST'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
    };
  }
}
