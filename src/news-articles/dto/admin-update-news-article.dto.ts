import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class AdminUpdateNewsArticleDto {
  @ApiProperty({
    description: 'Status of the news article',
    enum: Status,
    example: Status.APPROVED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Admin comment for the news article',
    example: 'The article does not meet our requirements.',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminComment?: string;
}
