import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Startup } from './entities/startup.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StartupRepository } from './startups.repository';
import { RatingRepository } from './startup-rating.repository';
import { StartupRating } from './entities/startup-rating.entity';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Startup, StartupRating]), AuthModule],
  controllers: [StartupsController],
  providers: [
    StartupsService,
    StartupRepository,
    RatingRepository,
    FilesService,
    FileRepository,
  ],
})
export class StartupsModule {}
