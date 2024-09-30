import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventRepository } from './events.repository';
import { Event } from './entities/event.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';
import { EventBookmarkRepository } from './event-bookmark.repository';
import { EventLikeRepository } from './event-like.repository';
import { EventLike } from './entities/event-likes.entity';
import { EventBookmark } from './entities/event-bookmarks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventLike, EventBookmark]),
    AuthModule,
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventRepository,
    FilesService,
    FileRepository,
    EventBookmarkRepository,
    EventLikeRepository,
  ],
})
export class EventsModule {}
