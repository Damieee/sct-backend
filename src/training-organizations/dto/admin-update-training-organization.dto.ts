import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class AdminUpdateTrainingOrganizationDto {
  @ApiProperty({
    description: 'Status of the training organization',
    enum: Status,
    example: Status.PUBLISHED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Admin comment for the training organization',
    example: 'The organization does not meet our requirements.',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminComment?: string;
}
