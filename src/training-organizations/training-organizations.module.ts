import { Module } from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { TrainingOrganizationsController } from './training-organizations.controller';

@Module({
  controllers: [TrainingOrganizationsController],
  providers: [TrainingOrganizationsService],
})
export class TrainingOrganizationsModule {}
