import { Module } from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { TrainingOrganizationsController } from './training-organizations.controller';
import { TrainingOrganization } from './entities/training-organization.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingOrganizationRepository } from './training-organizations.repository';
import { RatingRepository } from './training-organization-rating.repository';
import { OrganizationRating } from './entities/training-organization-rating.entity';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingOrganization, OrganizationRating]),
    AuthModule,
  ],
  controllers: [TrainingOrganizationsController],
  providers: [
    TrainingOrganizationsService,
    TrainingOrganizationRepository,
    RatingRepository,
    FilesService,
    FileRepository,
  ],
})
export class TrainingOrganizationsModule {}
