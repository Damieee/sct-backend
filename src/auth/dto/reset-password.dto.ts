import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The email of the user requesting a password reset',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The new password the user wants to set',
    example: 'newSecurePassword123!',
  })
  newPassword: string;

  @ApiProperty({
    description: 'The confirmation password the user wants to set',
    example: 'newSecurePassword123!',
  })
  confirmPassword: string;
}
