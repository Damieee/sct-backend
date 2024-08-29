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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-co-working-space.dto';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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
  @ApiBody({ type: filterDto })
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
  @ApiBody({ type: filterDto })
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
  ): Promise<CoWorkingSpace> {
    return this.coWorkingSpacesService.updateCoworkingSpace(
      id,
      updateCoWorkingSpaceDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/picture/:id')
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('file'))
  async addPicture(
    @Param('id') id: string,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return this.coWorkingSpacesService.addPicture(
      id,
      file.buffer,
      file.originalname,
    );
  }
}
