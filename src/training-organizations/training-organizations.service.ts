import { Injectable } from '@nestjs/common';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';

@Injectable()
export class TrainingOrganizationsService {
  create(createTrainingOrganizationDto: CreateTrainingOrganizationDto) {
    return 'This action adds a new trainingOrganization';
  }

  findAll() {
    return `This action returns all trainingOrganizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingOrganization`;
  }

  update(id: number, updateTrainingOrganizationDto: UpdateTrainingOrganizationDto) {
    return `This action updates a #${id} trainingOrganization`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingOrganization`;
  }
}
