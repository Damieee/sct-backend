import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrganizationSubcategory } from '../../shared/organization-subcategory.enum';
import { Status } from '../../enums/status.enum';

export class GetOrganizationDto {
  @IsOptional()
  @IsEnum(OrganizationSubcategory)
  subcategory?: OrganizationSubcategory;

  @IsOptional()
  @IsEnum(Status)
  @Transform(({ value }) => {
    // Handle case-insensitive status values
    if (value === 'PENDING' || value === 'pending') return Status.PENDING;
    if (value === 'APPROVED' || value === 'published') return Status.APPROVED;
    if (value === 'REJECTED' || value === 'Not Accepted') return Status.REJECTED;
    return value;
  })
  status?: Status;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeRelated?: boolean;
} 