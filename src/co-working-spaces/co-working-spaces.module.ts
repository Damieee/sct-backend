import { Module } from '@nestjs/common';
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CoWorkingSpacesController } from './co-working-spaces.controller';

@Module({
  controllers: [CoWorkingSpacesController],
  providers: [CoWorkingSpacesService],
})
export class CoWorkingSpacesModule {}
