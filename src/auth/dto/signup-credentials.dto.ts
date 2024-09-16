import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatch } from '../match.decorator';
export class SignupCredentialsDto {
  @ApiProperty({
    description: ' Full Name of The User',
    example: 'Dare Ezekiel',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  full_name: string;

  @ApiProperty({
    description: 'Email of The User',
    example: 'joshezekiel.dev@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password  of The User',
    example: 'oSaS-3958425',
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    description: 'Confirm Password  of The User',
    example: 'oSaS-3958425',
  })
  @IsString()
  @IsMatch('password', { message: 'Confirm password must match password' })
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  passwordConfirm: string;
}
