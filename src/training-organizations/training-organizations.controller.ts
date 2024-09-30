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
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TrainingOrganizationsService } from './training-organizations.service';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-training-organization.dto';
import { TrainingOrganization } from './entities/training-organization.entity';
import { User } from 'src/auth/user.entity';
import { RateTrainingOrganizationDto } from './dto/rating.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('training-organizations')
@Controller('training-organizations')
export class TrainingOrganizationsController {
  constructor(
    private readonly trainingOrganizationsService: TrainingOrganizationsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth('JWT')
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
  getTrainingOrganizations(
    @Query() trainingOrganizationFilterDto: filterDto,
  ): Promise<TrainingOrganization[]> {
    return this.trainingOrganizationsService.getTrainingOrganizations(
      trainingOrganizationFilterDto,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Training Organization By ID' })
  @ApiResponse({
    status: 200,
    description: 'Training organization has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getTrainingOrganizationById(
    @Param('id') id: string,
  ): Promise<TrainingOrganization> {
    return this.trainingOrganizationsService.getTrainingOrganizationById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @ApiBearerAuth('JWT')
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

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiBearerAuth('JWT')
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
    return this.trainingOrganizationsService.deleteTrainingOrganization(
      id,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rate')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rate Training Organization' })
  @ApiResponse({
    status: 201,
    description: 'Training Organization rating has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RateTrainingOrganizationDto })
  async rate(
    @Param('id') trainingOrganizationId: string,
    @Body() ratingDto: RateTrainingOrganizationDto,
    @GetUser() user: User,
  ) {
    try {
      return this.trainingOrganizationsService.rateTrainingOrganization(
        trainingOrganizationId,
        ratingDto,
        user,
      );
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Get Training Organization Ratings and Reviews' })
  @ApiResponse({
    status: 201,
    description:
      'Training Organization ratings and reviews have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getOrganizationRatingsAndReviews(
    @Param('id') trainingOrganizationId: string,
  ) {
    return await this.trainingOrganizationsService.getOrganizationRatingAndReviews(
      trainingOrganizationId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pictures/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Training Organization Pictures' })
  @ApiConsumes('multipart/form-data') // Specify file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  }) // Swagger body for file upload
  @ApiResponse({
    status: 201,
    description: 'Training Organization pictures have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('files')) // Use FilesInterceptor for multiple file upload
  async addPictures(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[], // Expect an array of files
    @GetUser() user: User,
  ) {
    return this.trainingOrganizationsService.addPictures(id, files, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/pictures/:trainingOrganizationId/:fileId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Training Organization Picture' })
  async deletePicture(
    @Param('trainingOrganizationId') trainingOrganizationId: string,
    @Param('fileId') fileId: string,
    @GetUser() user: User,
  ) {
    return this.trainingOrganizationsService.deletePicture(
      trainingOrganizationId,
      fileId,
      user,
    );
  }
}
