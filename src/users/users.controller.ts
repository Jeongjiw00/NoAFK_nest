import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { signUpUserDto } from './dto/signup-user.dto';
import { signInUserDto } from './dto/signin-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/signup')
  async signUp(@Body() userInfo: signUpUserDto) {
    console.log(userInfo);

    return await this.userService.signUp(userInfo);
  }

  @Post('/signin')
  async signIn(@Body() userInfo: signInUserDto, @Res() res) {
    const { accessToken, refreshToken } =
      await this.userService.signInUser(userInfo);

    res.cookie('accessToken', accessToken, {
      //브라우저에서 쿠키에 접근할 수 없도록 제한
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return res.send();
  }

  @UseGuards(AuthGuard)
  @Get('/isLoggedIn')
  async isLoggedIn(@Req() req) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      return { isLoggedIn, userInfo: null };
    }

    const userInfo = await this.userService.findUserByUserId(userId);

    return { isLoggedIn, userInfo };
  }

  @UseGuards(AuthGuard)
  @Get('/signout')
  async signOut(@Req() req, @Res() res) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await this.authService.removeRefreshToken(userId);

    return res.send();
  }

  // 마이페이지 회원 정보 가져오기
  @UseGuards(AuthGuard)
  @Get('/')
  async getUser(@Req() req): Promise<Users> {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    return await this.userService.findUserByUserId(userId);
  }

  // 마이페이지 회원 정보 수정
  @UseGuards(AuthGuard)
  @Patch('/')
  async updateUser(@Body() userInfo: UpdateUserDto, @Req() req) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    return await this.userService.updateUserProfile(userId, userInfo);
  }
}
