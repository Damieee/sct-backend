import { PartialType } from '@nestjs/mapped-types';
import { CreateCoWorkingSpaceDto } from './create-co-working-space.dto';

export class UpdateCoWorkingSpaceDto extends PartialType(
  CreateCoWorkingSpaceDto,
) {}
// can read documentation here ;
// https://trilon.io/blog/introducing-mapped-types-for-nestjs
