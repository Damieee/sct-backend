import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-training-organization.dto';
import { TrainingOrganization } from './entities/training-organization.entity';
import { User } from 'src/auth/user.entity';

@ApiTags('training-organizations')
@Controller('training-organizations')
@UseGuards(AuthGuard())
export class TrainingOrganizationsController {
  constructor(
    private readonly trainingOrganizationsService: TrainingOrganizationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a new Training Organization' })
  @ApiResponse({
    status: 201,
    description: 'Training organization has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTrainingOrganizationDto })
  createTrainingOrganization(
    @Body() createTrainingOrganizationDto: CreateTrainingOrganizationDto,
    @GetUser() user: User,
  ): Promise<TrainingOrganization> {
    return this.trainingOrganizationsService.createTrainingOrganization(
      createTrainingOrganizationDto,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all Training Organizations' })
  @ApiResponse({
    status: 200,
    description: 'Training organizations have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: filterDto })
  getTrainingOrganizations(
    @Query() filterDto: filterDto,
  ): Promise<TrainingOrganization[]> {
    return this.trainingOrganizationsService.getTrainingOrganizations(filterDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Training Organization By ID' })
  @ApiResponse({
    status: 200,
    description: 'Training organization has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getTrainingOrganizationById(@Param('id') id: string): Promise<TrainingOrganization> {
    return this.trainingOrganizationsService.getTrainingOrganizationById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update Training Organization By ID' })
  @ApiResponse({
    status: 200,
    description: 'Training organization has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UpdateTrainingOrganizationDto })
  updateTrainingOrganization(
    @Param('id') id: string,
    @Body() updateTrainingOrganizationDto: UpdateTrainingOrganizationDto,
    @GetUser() user: User,
  ): Promise<TrainingOrganization> {
    return this.trainingOrganizationsService.updateTrainingOrganization(
      id,
      updateTrainingOrganizationDto,
      user,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Training Organization By ID' })
  @ApiResponse({
    status: 200,
    description: 'Training organization has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteTrainingOrganization(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.trainingOrganizationsService.deleteTrainingOrganization(id, user);
  }
}
