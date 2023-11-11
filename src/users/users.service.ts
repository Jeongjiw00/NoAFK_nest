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
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async findAllUsers() {
    try {
      return await this.userRepository.find({
        select: [
          'userId',
          'email',
          'password',
          'nickname',
          'profileImg',
          'introduction',
          'authLevel',
          'createdAt',
        ],
      });
    } catch (error) {
      throw error;
    }
  }

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
      select: [
        'userId',
        'email',
        'password',
        'nickname',
        'profileImg',
        'introduction',
        'authLevel',
        'createdAt',
      ],
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

      await this.authService.setRefreshToken(user.userId, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  // 회원 정보 수정
  async updateUserProfile(userId: number, userInfo: UpdateUserDto) {
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

      await this.userRepository.update(userId, { ...userInfo });
    } catch (error) {
      throw error;
    }
  }
}
