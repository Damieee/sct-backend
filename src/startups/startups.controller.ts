import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';

@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Post()
  create(@Body() createStartupDto: CreateStartupDto) {
    return this.startupsService.create(createStartupDto);
  }

  @Get()
  findAll() {
    return this.startupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.startupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStartupDto: UpdateStartupDto) {
    return this.startupsService.update(+id, updateStartupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.startupsService.remove(+id);
  }
}
