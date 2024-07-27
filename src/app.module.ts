import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TrainingOrganizationsModule } from './training-organizations/training-organizations.module';
import { CoWorkingSpacesModule } from './co-working-spaces/co-working-spaces.module';
import { StartupsModule } from './startups/startups.module';
import { NewsArticlesModule } from './news-articles/news-articles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [UsersModule, EventsModule, TrainingOrganizationsModule, CoWorkingSpacesModule, StartupsModule, NewsArticlesModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
