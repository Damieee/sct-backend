import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
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
import { Startup } from './entities/startup.entity';
import { User } from 'src/auth/user.entity';
import { RateStartupDto } from './dto/startup-rating.dto';
import { filterDto } from './dto/get-startup.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('startups')
@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth('JWT')
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
  getStartups(@Query() startupfilter: filterDto): Promise<Startup[]> {
    return this.startupsService.getStartups(startupfilter);
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @ApiBearerAuth('JWT')
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

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiBearerAuth('JWT')
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rate')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Rate Startup' })
  @ApiResponse({
    status: 201,
    description: 'Startup rating has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RateStartupDto })
  async rate(
    @Param('id') startupId: string,
    @Body() ratingDto: RateStartupDto,
    @GetUser() user: User,
  ) {
    try {
      return this.startupsService.rateStartup(startupId, ratingDto, user);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pictures/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Startup Pictures' })
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
    description: 'Startup pictures have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('files')) // Use FilesInterceptor for multiple file upload
  async addPictures(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[], // Expect an array of files
    @GetUser() user: User,
  ) {
    return this.startupsService.addPictures(id, files, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/pictures/:startupId/:fileId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Startup Picture' })
  async deletePicture(
    @Param('startupId') startupId: string,
    @Param('fileId') fileId: string,
    @GetUser() user: User,
  ) {
    return this.startupsService.deletePicture(startupId, fileId, user);
  }
}
