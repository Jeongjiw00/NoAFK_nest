import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { signUpUserDto } from './dto/signup-user.dto';
import { signInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async findExistUser(column) {
    try {
      return await this.userRepository.count({
        where: { ...column },
      });
    } catch (error) {
      throw error;
    }
  }

  async findUserByUserId(userId: number): Promise<Users> {
    const userInfo = await this.userRepository.findOne({
      where: { userId },
    });

    return userInfo;
  }

  async signUp(userInfo: signUpUserDto) {
    try {
      const duplicatedCheckArray = [
        { email: userInfo.email },
        { nickname: userInfo.nickname },
      ];

      for (let column of duplicatedCheckArray) {
        const exist = await this.findExistUser(column);

        if (exist) {
          throw new ConflictException(`이미 존재하는 ${column} 입니다.`);
        }
      }

      const hashedPassword = await bcrypt.hash(userInfo.password, 258);
      userInfo.password = hashedPassword;

      await this.userRepository.save(userInfo);
    } catch (error) {
      throw error;
    }
  }

  async findUser(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw error;
    }
  }

  async createAccessToken(userId: number) {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });
  }

  async createRefreshToken() {
    return await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1d',
      },
    );
  }

  async getRefreshToken(userId: number) {
    return await this.redis.get(`refreshToken-${userId}`);
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.redis.set(`refreshToken-${userId}`, refreshToken, 'EX', 86400);
  }

  async removeRefreshToken(userId: number) {
    await this.redis.del(`refreshToken-${userId}`);
  }

  async signInUser(userInfo: signInUserDto) {
    try {
      const user = await this.findUser(userInfo.email);

      if (!user) {
        throw new UnauthorizedException('이메일이 일치하지 않습니다.');
      }

      const compare = await bcrypt.compare(userInfo.password, user.password);

      if (!compare) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      // token
      const accessToken = await this.createAccessToken(user.userId);

      const refreshToken = await this.createRefreshToken();

      await this.setRefreshToken(user.userId, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
