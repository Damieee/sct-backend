import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Startup } from './entities/startup.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StartupRepository } from './startups.repository';
import { RatingRepository } from './startup-rating.repository';
import { StartupRating } from './entities/startup-rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Startup, StartupRating]), AuthModule],
  controllers: [StartupsController],
  providers: [StartupsService, StartupRepository, RatingRepository],
})
export class StartupsModule {}
