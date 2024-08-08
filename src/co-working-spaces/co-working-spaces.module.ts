import { Module } from '@nestjs/common';
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CoWorkingSpacesController } from './co-working-spaces.controller';
import { CoWorkingSpaceRepository } from './co-working-spaces.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CoWorkingSpace]), AuthModule],
  controllers: [CoWorkingSpacesController],
  providers: [CoWorkingSpacesService, CoWorkingSpaceRepository],
})
export class CoWorkingSpacesModule {}
