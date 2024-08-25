import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileRepository } from './files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigModule],
  controllers: [FilesController],
  providers: [FilesService, FileRepository],
})
export class FilesModule {}
