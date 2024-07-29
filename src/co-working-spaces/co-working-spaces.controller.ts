import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';

@Controller('co-working-spaces')
export class CoWorkingSpacesController {
  constructor(
    private readonly coWorkingSpacesService: CoWorkingSpacesService,
  ) {}

  @Post()
  create(@Body() createCoWorkingSpaceDto: CreateCoWorkingSpaceDto) {
    return this.coWorkingSpacesService.create(createCoWorkingSpaceDto);
  }

  @Get()
  findAll() {
    return this.coWorkingSpacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coWorkingSpacesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoWorkingSpaceDto: UpdateCoWorkingSpaceDto,
  ) {
    return this.coWorkingSpacesService.update(+id, updateCoWorkingSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coWorkingSpacesService.remove(+id);
  }
}
