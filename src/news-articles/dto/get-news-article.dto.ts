import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '../category.enum';

export class filterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({
    description: 'Category of the News',
    example: 'FinTech',
    enum: Category,
  })
  @IsEnum(Category)
  @IsOptional()
  category: Category;
}
