import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingOrganizationDto } from './create-training-organization.dto';

export class UpdateTrainingOrganizationDto extends PartialType(CreateTrainingOrganizationDto) {}
