import { Module } from '@nestjs/common';
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CoWorkingSpacesController } from './co-working-spaces.controller';
import { CoWorkingSpaceRepository } from './co-working-spaces.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';
import { ConfigService } from '@nestjs/config';
import { RatingRepository } from './rating.repository';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoWorkingSpace, Rating]), AuthModule],
  controllers: [CoWorkingSpacesController],
  providers: [
    CoWorkingSpacesService,
    CoWorkingSpaceRepository,
    RatingRepository,
    FilesService,
    FileRepository,
    ConfigService,
  ],
})
export class CoWorkingSpacesModule {}
