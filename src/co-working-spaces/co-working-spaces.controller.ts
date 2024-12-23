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
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-co-working-space.dto';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { User, UserRole } from 'src/auth/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateCoworkingSpaceDto } from './dto/rating.dto';
import { AdminUpdateCoWorkingSpaceDto } from './dto/admin-update-co-working-space.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('co-working-spaces')
@Controller('co-working-spaces')
export class CoWorkingSpacesController {
  constructor(
    private readonly coWorkingSpacesService: CoWorkingSpacesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Add a new Co-WorkSpace' })
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateCoWorkingSpaceDto })
  createCoworkingSpace(
    @Body() createCoWorkingSpaceDto: CreateCoWorkingSpaceDto,
    @GetUser() user: User,
  ): Promise<CoWorkingSpace> {
    return this.coWorkingSpacesService.createCoworkingspace(
      createCoWorkingSpaceDto,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all Co-WorkSpaces' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getCoworkingSpace(
    @Query() coWorkingSpaceFilterDto: filterDto,
  ): Promise<CoWorkingSpace[]> {
    return this.coWorkingSpacesService.getCoworkingspaces(
      coWorkingSpaceFilterDto,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Co-WorkSpace By ID' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getCoworkingSpaceById(@Param('id') id: string): Promise<CoWorkingSpace> {
    return this.coWorkingSpacesService.getcoWorkingSpaceById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Co-WorkSpace By ID' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteCoworkingSpace(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.coWorkingSpacesService.deleteCoworkingSpace(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update Co-WorkSpace By ID' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UpdateCoWorkingSpaceDto })
  updateCoWorkingSpace(
    @Param('id') id: string,
    @Body() updateCoWorkingSpaceDto: UpdateCoWorkingSpaceDto,
    @GetUser() user: User,
  ): Promise<CoWorkingSpace> {
    return this.coWorkingSpacesService.updateCoworkingSpace(
      id,
      user,
      updateCoWorkingSpaceDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pictures/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Co-WorkSpace Pictures' })
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
    description: 'Co-WorkSpace pictures have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('files')) // Use FilesInterceptor for multiple file upload
  async addPictures(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[], // Expect an array of files
    @GetUser() user: User,
  ) {
    return this.coWorkingSpacesService.addPictures(id, files, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/pictures/:coworkingSpaceId/:fileId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Co-WorkSpace Picture' })
  async deletePicture(
    @Param('coworkingSpaceId') coworkingSpaceId: string,
    @Param('fileId') fileId: string,
    @GetUser() user: User,
  ) {
    return this.coWorkingSpacesService.deletePicture(
      coworkingSpaceId,
      fileId,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rate')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rate Co-WorkSpace' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace rating has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RateCoworkingSpaceDto })
  async rate(
    @Param('id') coworkingSpaceId: string,
    @Body() ratingDto: RateCoworkingSpaceDto,
    @GetUser() user: User,
  ) {
    try {
      return this.coWorkingSpacesService.rateCoworkingSpace(
        coworkingSpaceId,
        ratingDto,
        user,
      );
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Get Co-WorkSpace Ratings and Reviews' })
  @ApiResponse({
    status: 201,
    description:
      'Co-WorkSpace ratings and reviews have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getSpaceRatingsAndReviews(@Param('id') coworkingSpaceId: string) {
    return await this.coWorkingSpacesService.getSpaceRatingAndReviews(
      coworkingSpaceId,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @Patch('/admin/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Admin Update Co-WorkSpace By ID' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully updated by admin.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: AdminUpdateCoWorkingSpaceDto })
  async adminUpdateCoWorkingSpace(
    @Param('id') id: string,
    @Body() adminUpdateDto: AdminUpdateCoWorkingSpaceDto,
  ): Promise<CoWorkingSpace> {
    return this.coWorkingSpacesService.adminUpdateCoworkingSpace(
      id,
      adminUpdateDto,
    );
  }

  @Get('/vectorsearch/:query')
  @ApiOperation({ summary: 'Vector Search Co-WorkSpaces' })
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({ name: 'query', type: String })
  async vectorSearch(
    @Query('query') searchQuery: string,
  ): Promise<CoWorkingSpace[]> {
    try {
      return this.coWorkingSpacesService.vectorSearch(searchQuery);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
