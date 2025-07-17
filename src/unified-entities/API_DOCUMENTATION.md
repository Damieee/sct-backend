# Unified Entities API Documentation

## Overview
The Unified Entities module provides a single endpoint to create and manage different types of entities (events, startups, coworking spaces, training organizations, news articles) through a unified interface.

## Entity Types

The following entity types are supported:

| Entity Type | Value | Description |
|-------------|-------|-------------|
| Events | `events` | Events with date/time, organizer info, pricing, etc. |
| Startups | `startups` | Startups with social media, tags, logo, etc. |
| CoWorking Spaces | `coWorkingSpaces` | Coworking spaces with daily rates, opening hours, facilities |
| Training Organizations | `trainingOrganizations` | Training organizations with courses, opening hours |
| News Articles | `newsArticles` | News articles with content and category |

## API Endpoints

### 1. Create Unified Entity
```
POST /unified-entities
```

**Authentication:** Required (JWT Bearer Token)

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
  "name": "TechStartup Inc",
  "description": "A revolutionary tech startup",
  "location": {
    "address": "456 Innovation Drive",
    "url": "https://maps.google.com/...",
    "latitude": 41.88193,
    "longitude": -152.31368,
    "city": "Tech City",
    "state_province": "California",
    "country": "USA",
    "postal_code": "90210"
  },
  "information": {
    "socialMedia": {
      "website": "https://techstartup.com",
      "facebook": "https://facebook.com/techstartup",
      "instagram": "https://instagram.com/techstartup",
      "twitter": "https://twitter.com/techstartup",
      "linkedIn": "https://linkedin.com/company/techstartup"
    },
    "phoneNumber": "+1-555-123-4567",
    "email": "contact@techstartup.com"
  },
  "tags": ["AI", "Machine Learning", "Tech"],
  "logo": "https://example.com/logo.png",
  "category": "AI"
}
```

### 2. Get All Unified Entities
```
GET /unified-entities
```

**Authentication:** Not required

**Query Parameters:**
- `entityType` (optional): Filter by entity type (`events`, `startups`, `coWorkingSpaces`, `trainingOrganizations`, `newsArticles`)
- `search` (optional): Search term to filter entities
- `category` (optional): Filter by category

**Example:**
```
GET /unified-entities?entityType=startups&search=tech&category=AI
```

### 3. Get Unified Entities by Type
```
GET /unified-entities/by-type/{entityType}
```

**Authentication:** Not required

**Path Parameters:**
- `entityType`: One of `events`, `startups`, `coWorkingSpaces`, `trainingOrganizations`, `newsArticles`

**Example:**
```
GET /unified-entities/by-type/startups
```

### 4. Get Unified Entity by ID
```
GET /unified-entities/{id}
```

**Authentication:** Not required

**Path Parameters:**
- `id`: UUID of the unified entity

**Example:**
```
GET /unified-entities/123e4567-e89b-12d3-a456-426614174000
```

### 5. Get Unified Entity by Type and ID
```
GET /unified-entities/{entityType}/{id}
```

**Authentication:** Not required

**Path Parameters:**
- `entityType`: One of `events`, `startups`, `coWorkingSpaces`, `trainingOrganizations`, `newsArticles`
- `id`: UUID of the unified entity

**Example:**
```
GET /unified-entities/startups/123e4567-e89b-12d3-a456-426614174000
```

### 6. Like Unified Entity
```
POST /unified-entities/{unifiedEntityId}/like
```

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

### 7. Unlike Unified Entity
```
DELETE /unified-entities/{unifiedEntityId}/unlike
```

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

### 8. Bookmark Unified Entity
```
POST /unified-entities/{unifiedEntityId}/bookmark
```

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

### 9. Unbookmark Unified Entity
```
DELETE /unified-entities/{unifiedEntityId}/unbookmark
```

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

### 10. Rate Unified Entity
```
POST /unified-entities/{unifiedEntityId}/rate
```

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

**Request Body:**
```json
{
  "rating": 4,
  "review": "Great unified entity!"
}
```

### 11. Get Unified Entity Ratings
```
GET /unified-entities/{unifiedEntityId}/ratings
```

**Authentication:** Not required

**Path Parameters:**
- `unifiedEntityId`: UUID of the unified entity

## Common Errors

### Invalid Entity Type
If you use an incorrect entity type, you'll get an error like:
```
invalid input value for enum unified_entity_entitytype_enum: "startup"
```

**Correct values:**
- ✅ `events` (not "event")
- ✅ `startups` (not "startup")
- ✅ `coWorkingSpaces` (not "coworking_space")
- ✅ `trainingOrganizations` (not "training_organization")
- ✅ `newsArticles` (not "news_article")

## Response Examples

### Successful Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "entityType": "startups",
  "name": "TechStartup Inc",
  "description": "A revolutionary tech startup",
  "averageRating": 4.5,
  "totalRatings": 10,
  "ratingsCount": 2,
  "status": "PENDING",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Error Response
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

## Notes

1. **Entity Type Values**: Always use the exact enum values shown in the table above
2. **Authentication**: Some endpoints require JWT authentication
3. **Validation**: All inputs are validated according to the entity type requirements
4. **Relationships**: Unified entities support likes, bookmarks, and ratings like other modules 