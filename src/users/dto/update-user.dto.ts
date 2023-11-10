import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'email' })
  email?: string;

  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    { message: 'newPassword' },
  )
  password: string;

  @IsOptional()
  @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AFa-z\d]{2,15}$/, {
    message: 'nickname',
  })
  nickname?: string;

  @IsOptional()
  @IsString({ message: 'introduction' })
  introduction?: string;
}
