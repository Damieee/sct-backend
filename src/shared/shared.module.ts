import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityRelationshipService } from './services/entity-relationship.service';
import { MultiEntityService } from './services/multi-entity.service';
import { EntityRelationship } from './entities/entity-relationship.entity';
import { OrganizationsModule } from '../organizations/organizations.module';
import { StartupsModule } from '../startups/startups.module';
import { EventsModule } from '../events/events.module';
import { NewsArticlesModule } from '../news-articles/news-articles.module';
import { CoWorkingSpacesModule } from '../co-working-spaces/co-working-spaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntityRelationship]),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => StartupsModule),
    forwardRef(() => EventsModule),
    forwardRef(() => NewsArticlesModule),
    forwardRef(() => CoWorkingSpacesModule),
  ],
  providers: [EntityRelationshipService, MultiEntityService],
  exports: [EntityRelationshipService, MultiEntityService, TypeOrmModule],
})
export class SharedModule {} 