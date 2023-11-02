import { Matches, IsEmail } from 'class-validator';

export class signUpUserDto {
  @IsEmail({}, { message: 'email' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    { message: 'password' },
  )
  password: string;

  @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AFa-z\d]{2,15}$/, {
    message: 'nickname',
  })
  nickname: string;
}
