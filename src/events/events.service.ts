import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './event.repository'; // Adjust this import based on your actual repository file
import { Event } from './entities/event.entity';
import { User } from 'src/auth/user.entity';

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
    const event = this.eventRepository.create({
      ...createEventDto,
      user, // Assuming you want to associate the event with the user
    });
    await this.eventRepository.save(event);
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find();
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
