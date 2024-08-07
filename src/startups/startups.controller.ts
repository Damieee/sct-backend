import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Startup } from './entities/startup.entity';
import { User } from 'src/auth/user.entity';

@ApiTags('startups')
@Controller('startups')
@UseGuards(AuthGuard())
export class StartupsController {
  constructor(
    private readonly startupsService: StartupsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a new Startup' })
  @ApiResponse({
    status: 201,
    description: 'Startup has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateStartupDto })
  createStartup(
    @Body() createStartupDto: CreateStartupDto,
    @GetUser() user: User,
  ): Promise<Startup> {
    return this.startupsService.createStartup(createStartupDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Startups' })
  @ApiResponse({
    status: 200,
    description: 'Startups have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getStartups(): Promise<Startup[]> {
    return this.startupsService.getStartups();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Startup By ID' })
  @ApiResponse({
    status: 200,
    description: 'Startup has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getStartupById(@Param('id') id: string): Promise<Startup> {
    return this.startupsService.getStartupById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update Startup By ID' })
  @ApiResponse({
    status: 200,
    description: 'Startup has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UpdateStartupDto })
  updateStartup(
    @Param('id') id: string,
    @Body() updateStartupDto: UpdateStartupDto,
    @GetUser() user: User,
  ): Promise<Startup> {
    return this.startupsService.updateStartup(id, updateStartupDto, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Startup By ID' })
  @ApiResponse({
    status: 200,
    description: 'Startup has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteStartup(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.startupsService.deleteStartup(id, user);
  }
}
