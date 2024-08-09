import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Startup } from './entities/startup.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Startup]), AuthModule],
  controllers: [StartupsController],
  providers: [StartupsService],
})
export class StartupsModule {}
