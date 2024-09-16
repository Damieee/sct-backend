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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-co-working-space.dto';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { RateCoworkingSpaceDto } from './dto/rating.dto';

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
  @Post('/picture/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Co-WorkSpace Picture' })
  @ApiConsumes('multipart/form-data') // Specify file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }) // Swagger body for file upload
  @ApiResponse({
    status: 201,
    description: 'Co-WorkSpace picture has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('file'))
  async addPicture(
    @Param('id') id: string,
    @UploadedFiles() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.coWorkingSpacesService.addPicture(
      id,
      file.buffer,
      file.originalname,
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
  @ApiResponse({
    status: 409,
    description: 'You have already rated this coworking space.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
}
