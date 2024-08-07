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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Event } from './entities/event.entity';
import { User } from 'src/auth/user.entity';

@ApiTags('events')
@Controller('events')
@UseGuards(AuthGuard())
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
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
  getEvents(): Promise<Event[]> {
    return this.eventsService.getEvents();
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

  @Patch('/:id')
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

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteEvent(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.eventsService.deleteEvent(id, user);
  }
}
