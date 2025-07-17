# Unified Entities Module

This module provides a unified way to create and manage different types of entities (events, startups, coworking spaces, training organizations, news articles) through a single endpoint.

## Features

- **Single Endpoint**: Use one endpoint to create any type of entity
- **Type Validation**: Automatic validation based on entity type
- **Nullable Fields**: All fields are nullable to prevent bottlenecks
- **Type Identifier**: Each entity has a `entityType` field to identify its type

## Entity Types

- `events` - Events with date/time, organizer info, pricing, etc.
- `startups` - Startups with social media, tags, logo, etc.
- `coWorkingSpaces` - Coworking spaces with daily rates, opening hours, facilities
- `trainingOrganizations` - Training organizations with courses, opening hours
- `newsArticles` - News articles with content and category

## API Endpoints

### Create Unified Entity
```
POST /unified-entities
```

**Request Body Example (Event):**
```json
{
  "entityType": "events",
  "title": "Tech Conference 2024",
  "about_event": "Join us for an amazing tech conference",
  "type": "In-Person",
  "date_time": {
    "startDate": "2024-01-15T10:00:00Z",
    "endDate": "2024-01-15T18:00:00Z"
  },
  "location": {
    "address": "123 Tech Street",
    "url": "https://maps.google.com/...",
    "latitude": 41.88193,
    "longitude": -152.31368,
    "city": "Anytown",
    "state_province": "Alaska",
    "country": "USA",
    "postal_code": "99547"
  },
  "organizer": {
    "name": "Dare Ezekiel",
    "email": "joshezekiel.dev@gmail.com",
    "phone_number": "+234 906 453 1233",
    "website": "https://www.secondarycity.tech"
  },
  "category": "AI",
  "pricing": 4500,
  "registration_url": "https://www.eventbrite.com/e/event-name-123"
}
```

**Request Body Example (Startup):**
```json
{
  "entityType": "startups",
  "name": "Secondary City Tech",
  "description": "A leading tech company",
  "location": {
    "address": "123 Tech Street",
    "url": "https://maps.google.com/...",
    "latitude": 41.88193,
    "longitude": -152.31368,
    "city": "Anytown",
    "state_province": "Alaska",
    "country": "USA",
    "postal_code": "99547"
  },
  "category": "AI",
  "information": {
    "socialMedia": {
      "website": "https://www.secondarycity.tech/",
      "facebook": "https://facebook.com/secondarycity",
      "instagram": "https://instagram.com/secondarycity",
      "twitter": "https://x.com/secondarycity",
      "linkedIn": "https://linkedin.com/secondarycity",
      "youTube": "https://youtube.com/secondarycity"
    },
    "phoneNumber": "+1 555 123 4567",
    "email": "info@secondarycity.tech"
  },
  "tags": { "tags": ["tech", "startup"] },
  "logo": "https://example.com/logo.png"
}
```

**Request Body Example (CoWorking Space):**
```json
{
  "entityType": "coWorkingSpaces",
  "name": "Tech Hub Workspace",
  "location": {
    "address": "123 Tech Street",
    "url": "https://maps.google.com/...",
    "latitude": 41.88193,
    "longitude": -152.31368,
    "city": "Anytown",
    "state_province": "Alaska",
    "country": "USA",
    "postal_code": "99547"
  },
  "daily_rate": 7500,
  "opening_hour": {
    "week_start": "Monday",
    "week_end": "Friday",
    "opening_time": "09:00 AM",
    "closing_time": "06:00 PM"
  },
  "facilities": "WiFi, Conference Room, Coffee",
  "website": "https://www.techhub.com",
  "email": "info@techhub.com",
  "phone_number": "+234 906 453 1233"
}
```

**Request Body Example (Training Organization):**
```json
{
  "entityType": "trainingOrganizations",
  "name": "Tech Training Institute",
  "description": "Leading provider of tech training",
  "location": {
    "address": "123 Tech Street",
    "url": "https://maps.google.com/...",
    "latitude": 41.88193,
    "longitude": -152.31368,
    "city": "Anytown",
    "state_province": "Alaska",
    "country": "USA",
    "postal_code": "99547"
  },
  "courses": ["Web Development", "Data Science", "AI/ML"],
  "opening_hour": {
    "week_start": "Monday",
    "week_end": "Friday",
    "opening_time": "09:00 AM",
    "closing_time": "06:00 PM"
  },
  "logo": "https://example.com/logo.png",
  "website": "https://www.techtraining.com",
  "email": "info@techtraining.com",
  "phone_number": "+234 906 453 1233"
}
```

**Request Body Example (News Article):**
```json
{
  "entityType": "newsArticles",
  "title": "Latest Tech Trends",
  "content": "This article discusses the latest trends in technology...",
  "category": "AI",
  "image": "https://example.com/article-image.jpg"
}
```

### Get All Unified Entities
```
GET /unified-entities
```

### Get Entities by Type
```
GET /unified-entities/by-type/:entityType
```

### Get Entity by ID
```
GET /unified-entities/:id
```

### Get Entity by Type and ID
```
GET /unified-entities/:entityType/:id
```

## Validation

The module automatically validates required fields based on the entity type:

- **Events**: title, about_event, type, date_time, location, organizer, category
- **Startups**: name, description, location, category
- **CoWorking Spaces**: name, location, daily_rate, opening_hour
- **Training Organizations**: name, description, location, courses, opening_hour
- **News Articles**: title, content, category

## Database Schema

The unified entity table includes all fields from all entity types, with most fields being nullable. The `entityType` field identifies which type of entity the record represents.

## Benefits

1. **Single Endpoint**: No need to maintain separate endpoints for each entity type
2. **Flexible**: Easy to add new entity types in the future
3. **Type Safety**: Automatic validation based on entity type
4. **Backward Compatible**: Existing entity types continue to work
5. **Scalable**: Reduces code duplication and maintenance overhead 