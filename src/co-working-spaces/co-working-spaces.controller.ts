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
import { CoWorkingSpacesService } from './co-working-spaces.service';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { filterDto } from './dto/get-co-working-space.dto';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { User } from 'src/auth/user.entity';

@ApiTags('co-working-spaces')
@Controller('co-working-spaces')
@UseGuards(AuthGuard())
export class CoWorkingSpacesController {
  constructor(
    private readonly coWorkingSpacesService: CoWorkingSpacesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a new Co-WorkSpace' })
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
  @ApiBody({ type: filterDto })
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

  @Delete('/:id')
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

  @Patch('/:id')
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
      updateCoWorkingSpaceDto,
      user,
    );
  }
}
