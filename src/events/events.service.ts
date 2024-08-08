import { Injectable, NotFoundException } from '@nestjs/common';
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
    const {
      title,
      description,
      date,
      location,
      offerings,
      organizer_name,
      time,
    } = createEventDto;
    const event = this.eventRepository.create({
      title: title,
      description: description,
      date: date,
      time: time,
      location: location,
      offerings: offerings,
      organizer_name: organizer_name,
      user,
    });
    await this.eventRepository.save(event);
    return event;
  }

  async getEvents(eventfilter: filterDto): Promise<Event[]> {
    const { search } = eventfilter;
    const query = this.eventRepository.createQueryBuilder('event');

    if (search) {
      query.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search) OR LOWER(event.location) LIKE LOWER(:search) OR LOWER(event.organizer_name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const event = await query.getMany();
    return event;
  }

  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id, user } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    Object.assign(event, updateEventDto);
    await this.eventRepository.save(event);
    return event;
  }

  async deleteEvent(id: string, user: User): Promise<string> {
    const result = await this.eventRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return `Event with ID ${id} deleted successfully`;
  }
}
