import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Category } from '../category.enum';

export class CreateStartupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  tags: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
