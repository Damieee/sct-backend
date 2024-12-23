import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
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
import { Event } from './entities/event.entity';
import { User, UserRole } from 'src/auth/user.entity';
import { filterDto } from './dto/get-events.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminUpdateEventDto } from './dto/admin-update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new Event' })
  @ApiResponse({
    status: 201,
    description: 'Event has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateEventDto })
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventsService.createEvent(createEventDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Events' })
  @ApiResponse({
    status: 200,
    description: 'Events have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getEvents(@Query() eventFilterDto: filterDto): Promise<Event[]> {
    return this.eventsService.getEvents(eventFilterDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getEventById(@Param('id') id: string): Promise<Event> {
    return this.eventsService.getEventById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update Event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UpdateEventDto })
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, updateEventDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pictures/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Event Pictures' })
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
    description: 'Event pictures have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('files')) // Use FilesInterceptor for multiple file upload
  async addPictures(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[], // Expect an array of files
    @GetUser() user: User,
  ) {
    return this.eventsService.addPictures(id, files, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/pictures/:eventId/:fileId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Event Picture' })
  async deletePicture(
    @Param('eventId') eventId: string,
    @Param('fileId') fileId: string,
    @GetUser() user: User,
  ) {
    return this.eventsService.deletePicture(eventId, fileId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete Event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteEvent(@Param('id') id: string, @GetUser() user: User): Promise<string> {
    return this.eventsService.deleteEvent(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':eventId/like')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Like Event' })
  @ApiResponse({
    status: 200,
    description: 'Event liked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to like event.' })
  async likeEvent(@Param('eventId') eventId: string, @GetUser() user: User) {
    return this.eventsService.likeEvent(eventId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':eventId/unlike')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Unlike Event' })
  @ApiResponse({
    status: 200,
    description: 'Event unliked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to unlike event.' })
  async unlikeEvent(@Param('eventId') eventId: string, @GetUser() user: User) {
    return this.eventsService.unlikeEvent(eventId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':eventId/bookmark')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Bookmark Event' })
  @ApiResponse({
    status: 200,
    description: 'Event bookmarked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to bookmark event.' })
  async bookmarkEvent(
    @Param('eventId') eventId: string,
    @GetUser() user: User,
  ) {
    return this.eventsService.bookmarkEvent(eventId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':eventId/unbookmark')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Unbookmark Event' })
  @ApiResponse({
    status: 200,
    description: 'Event unbookmarked successfully.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized to unbookmark event.',
  })
  async unbookmarkEvent(
    @Param('eventId') eventId: string,
    @GetUser() user: User,
  ) {
    return this.eventsService.unbookmarkEvent(eventId, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('/admin/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Admin Update Event By ID' })
  @ApiResponse({
    status: 201,
    description: 'Event has been successfully updated by admin.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: AdminUpdateEventDto })
  async adminUpdateEvent(
    @Param('id') id: string,
    @Body() adminUpdateDto: AdminUpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.adminUpdateEvent(id, adminUpdateDto);
  }
}
