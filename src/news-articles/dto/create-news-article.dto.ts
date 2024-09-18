import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../category.enum';

export class CreateNewsArticleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;
}
