import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TrainingOrganizationsModule } from './training-organizations/training-organizations.module';
import { CoWorkingSpacesModule } from './co-working-spaces/co-working-spaces.module';
import { StartupsModule } from './startups/startups.module';
import { NewsArticlesModule } from './news-articles/news-articles.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    EventsModule,
    TrainingOrganizationsModule,
    CoWorkingSpacesModule,
    StartupsModule,
    NewsArticlesModule,
    ReviewsModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
