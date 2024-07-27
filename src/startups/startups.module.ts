import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';

@Module({
  controllers: [StartupsController],
  providers: [StartupsService],
})
export class StartupsModule {}
