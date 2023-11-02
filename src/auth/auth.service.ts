import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
