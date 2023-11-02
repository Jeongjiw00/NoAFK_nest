import {
  Body,
  Controller,
  Get,
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

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  async signUp(@Body() userInfo: signUpUserDto) {
    return await this.userService.signUp(userInfo);
  }

  @Post('/signin')
  async signIn(@Body() userInfo: signInUserDto, @Res() res) {
    const { accessToken, refreshToken } =
      await this.userService.signInUser(userInfo);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return res.send();
  }

  // 로그인 유무
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

  // 로그아웃
  @UseGuards(AuthGuard)
  @Get('/signout')
  async signOut(@Req() req, @Res() res) {
    const { isLoggedIn, userId } = req.auth;

    // 이미 로그아웃 상태라면 불가능한 기능
    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    // Access Token, Refresh Token 다 지우기
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Redis Refresh Token 지우기
    await this.userService.removeRefreshToken(userId);

    return res.send();
  }
}
