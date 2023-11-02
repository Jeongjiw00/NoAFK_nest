import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class signInUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
