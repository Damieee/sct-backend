import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class AdminUpdateEventDto {
  @ApiProperty({
    description: 'Status of the event',
    enum: Status,
    example: Status.APPROVED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Admin comment for the event',
    example: 'The event does not meet our requirements.',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminComment?: string;
}
