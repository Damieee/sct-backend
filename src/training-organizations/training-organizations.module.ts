import { Module } from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { TrainingOrganizationsController } from './training-organizations.controller';
import { TrainingOrganization } from './entities/training-organization.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingOrganizationRepository } from './training-organizations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingOrganization]), AuthModule],
  controllers: [TrainingOrganizationsController],
  providers: [TrainingOrganizationsService, TrainingOrganizationRepository],
})
export class TrainingOrganizationsModule {}
