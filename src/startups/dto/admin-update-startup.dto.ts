import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class AdminUpdateStartupDto {
  @ApiProperty({
    description: 'Status of the startup',
    enum: Status,
    example: Status.PUBLISHED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Admin comment for the startup',
    example: 'The startup does not meet our requirements.',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminComment?: string;
}
