import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './events.repository';
import { Event } from './entities/event.entity';
import { User } from 'src/auth/user.entity';
import { filterDto } from './dto/get-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<Event> {
    try {
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const {
        title,
        description,
        date_time,
        location,
        offerings,
        organizer,
        pricing,
        registration_url,
        type,
      } = createEventDto;

      const event = this.eventRepository.create({
        title,
        description,
        date_time,
        location,
        offerings,
        organizer,
        pricing,
        registration_url,
        user,
        type,
      });
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getEvents(eventfilter: filterDto): Promise<Event[]> {
    try {
      const { search } = eventfilter;
      const query = this.eventRepository.createQueryBuilder('event');
      // Explicitly join the picture relation
      query.leftJoinAndSelect('coworkingspace.picture', 'picture');
      if (search) {
        query.andWhere(
          "(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search) OR LOWER(event.location->>'address') LIKE LOWER(:search) OR LOWER(event.organizer->>'name') LIKE LOWER(:search))",
          { search: `%${search}%` },
        );
      }

      const event = await query.getMany();
      return event;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      if (event.user.id != user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      Object.assign(event, updateEventDto);
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteEvent(id: string, user: User): Promise<string> {
    try {
      const result = await this.eventRepository.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return `Event with ID ${id} deleted successfully`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
