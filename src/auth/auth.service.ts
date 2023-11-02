import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
  ) {}

  async getRefreshToken(userId: number) {
    return await this.redis.get(`refreshToken-${userId}`);
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.redis.set(`refreshToken-${userId}`, refreshToken, 'EX', 86400);
  }

  async removeRefreshToken(userId: number) {
    await this.redis.del(`refreshToken-${userId}`);
  }

  // Token 검증
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Access Token 재발급
  async createAccessToken(userId: number) {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });
  }
}
