import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';

@Controller('training-organizations')
export class TrainingOrganizationsController {
  constructor(private readonly trainingOrganizationsService: TrainingOrganizationsService) {}

  @Post()
  create(@Body() createTrainingOrganizationDto: CreateTrainingOrganizationDto) {
    return this.trainingOrganizationsService.create(createTrainingOrganizationDto);
  }

  @Get()
  findAll() {
    return this.trainingOrganizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingOrganizationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingOrganizationDto: UpdateTrainingOrganizationDto) {
    return this.trainingOrganizationsService.update(+id, updateTrainingOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingOrganizationsService.remove(+id);
  }
}
