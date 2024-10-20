import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class AdminUpdateCoWorkingSpaceDto {
  @ApiProperty({
    description: 'Status of the coworking space',
    enum: Status,
    example: Status.PUBLISHED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Admin comment for the coworking space',
    example: 'The space does not meet our requirements.',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminComment?: string;
}
