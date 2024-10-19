import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './events.repository';
import { Event } from './entities/event.entity';
import { User } from 'src/auth/user.entity';
import { filterDto } from './dto/get-events.dto';
import { FilesService } from 'src/files/files.service';
import { EventLikeRepository } from './event-like.repository';
import { EventBookmarkRepository } from './event-bookmark.repository';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    @InjectRepository(EventLikeRepository)
    private eventLikeRepository: EventLikeRepository,
    @InjectRepository(EventBookmarkRepository)
    private eventBookmarkRepository: EventBookmarkRepository,
    private fileService: FilesService,
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
        about_event,
        organizer,
        pricing,
        registration_url,
        type,
        category,
      } = createEventDto;

      const event = this.eventRepository.create({
        title,
        description,
        date_time,
        location,
        about_event,
        organizer,
        pricing,
        registration_url,
        user,
        type,
        category,
      });
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getEvents(eventfilter: filterDto): Promise<Event[]> {
    try {
      const {
        description,
        location,
        pricing,
        title,
        type,
        category,
        fromDate,
        toDate,
      } = eventfilter;

      const query = this.eventRepository.createQueryBuilder('event');
      // Explicitly join the picture relation
      query
        .leftJoinAndSelect('event.pictures', 'picture')
        .leftJoinAndSelect('event.user', 'user');

      if (location) {
        query.andWhere('LOWER(event.location::text) LIKE LOWER(:location)', {
          location: `%${location}%`,
        });
      }

      // Filter by title
      if (title) {
        query.andWhere('LOWER(event.title) LIKE LOWER(:title)', {
          title: `%${title}%`,
        });
      }

      // Filter by description
      if (description) {
        query.andWhere('LOWER(event.description) LIKE LOWER(:description)', {
          description: `%${description}%`,
        });
      }

      if (pricing) {
        query.andWhere('event.pricing <= :pricing', {
          pricing: pricing,
        });
      }

      // Handle date range filtering for JSON date fields
      if (fromDate && toDate) {
        query.andWhere(
          `event.date_time->>'startDate' >= :fromDate AND event.date_time->>'endDate' <= :toDate`,
          {
            fromDate: fromDate,
            toDate: toDate,
          },
        );
      } else if (fromDate) {
        query.andWhere(`event.date_time->>'startDate' >= :fromDate`, {
          fromDate: fromDate,
        });
      } else if (toDate) {
        query.andWhere(`event.date_time->>'endDate' <= :toDate`, {
          toDate: toDate,
        });
      }

      // Filter by event type (e.g., In-Person, Online, etc.)
      if (type) {
        query.andWhere('event.type = :type', {
          type: type,
        });
      }

      // Filter by event type (e.g., In-Person, Online, etc.)
      if (category) {
        query.andWhere('event.category = :category', {
          category: category,
        });
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
      event.status = Status.PENDING;

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

  async addPictures(
    id: string,
    files: Express.Multer.File[], // accept multiple files
    user: User,
  ) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (event.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Iterate over the uploaded files, and add each to the File entity
    const uploadedFiles = [];
    for (const file of files) {
      const uploadedFile = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
      );
      uploadedFiles.push(uploadedFile);
    }

    // Append the newly uploaded files to the existing pictures
    event.pictures = [...event.pictures, ...uploadedFiles];
    await this.eventRepository.save(event);

    return uploadedFiles;
  }

  async deletePicture(eventId: string, fileId: string, user: User) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    if (event.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const picture = event.pictures.find((pic) => pic.id === fileId);
    if (!picture) {
      throw new NotFoundException(`Picture not found`);
    }

    // Remove the picture from the array and update the event
    event.pictures = event.pictures.filter((pic) => pic.id !== fileId);
    await this.eventRepository.save(event);

    // Delete the picture from storage
    await this.fileService.deletePublicFile(picture.id);

    return { message: 'Picture deleted successfully' };
  }

  async likeEvent(eventId: string, user: User) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      // Check if user has already rated the coworking space
      const existingLike = await this.eventLikeRepository.findOne({
        where: [{ event: { id: eventId }, user }],
      });

      if (existingLike) {
        throw new Error('You have already liked this event.');
      }
      const like = this.eventLikeRepository.create({
        event: event,
        user,
      });

      await this.eventLikeRepository.save(like);

      return like;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unlikeEvent(eventId: string, user: User) {
    try {
      const likedEvent = await this.eventLikeRepository.findOne({
        where: { event: { id: eventId }, user },
      });

      if (!likedEvent) {
        throw new NotFoundException('Event not found or not liked');
      }

      await this.eventLikeRepository.delete({
        event: { id: eventId },
        user: { id: user.id },
      });
      return { message: 'Event unliked successfully', status: 'success' };
    } catch (error) {
      // Handle specific errors or rethrow
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to unlike event');
    }
  }

  async bookmarkEvent(eventId: string, user: User) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      // Check if user has already bookmarked the event
      const existingBookmark = await this.eventBookmarkRepository.findOne({
        where: [{ event: { id: eventId }, user }],
      });
      if (existingBookmark) {
        throw new Error('You have already bookmarked this event.');
      }
      const bookmark = this.eventBookmarkRepository.create({
        event: event,
        user,
      });
      await this.eventBookmarkRepository.save(bookmark);
      return bookmark;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unbookmarkEvent(eventId: string, user: User) {
    try {
      const bookmarkedEvent = await this.eventBookmarkRepository.findOne({
        where: { event: { id: eventId }, user },
      });
      if (!bookmarkedEvent) {
        throw new NotFoundException('Event not found or not bookmarked');
      }
      await this.eventBookmarkRepository.delete({
        event: { id: eventId },
        user: { id: user.id },
      });
      return { message: 'Event un-bookmarked successfully', status: 'success' };
    } catch (error) {
      // Handle specific errors or rethrow
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to unbookmark event');
    }
  }
}
