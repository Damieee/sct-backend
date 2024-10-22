import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email of the user requesting a password reset',
    example: 'joshezekiel.dev@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
