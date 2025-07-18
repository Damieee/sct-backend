# Centralized Category System

This directory contains the centralized category system for the SCT Backend application.

## Overview

The category system has been centralized to ensure consistency across all entity types and make category management easier. All category-related changes should be made in one place: `src/shared/category.enum.ts`.

## Files

- `category.enum.ts` - The main category enum containing all categories used across the application
- `README.md` - This documentation file

## Category Structure

The categories are organized into groups:

### Organization Types (from organizations.csv)
- `STARTUP` - Startup companies
- `TECH_HUB_TRAINING_CENTER` - Tech hubs and training centers
- `COWORKING_SPACE` - Coworking spaces
- `TECH_COMMUNITY` - Tech communities
- `INNOVATION_LAB_ACCELERATOR` - Innovation labs and accelerators
- `BUSINESS_SUPPORT_DIGITAL_SERVICES` - Business support and digital services
- `DEVELOPMENT_PARTNER` - Development partners
- `GOVERNMENT_ORG_AGENCY` - Government organizations and agencies

### Tech Categories
- `FINTECH` - Financial Technology
- `EDTECH` - Education Technology
- `HEALTHCARE` - Health and Medical Services
- `ECOMMERCE` - E-Commerce
- `AI` - Artificial Intelligence
- `IOT` - Internet of Things
- `AGRITECH` - Agriculture Technology
- `GREENTECH` - Green Technology
- `BIOTECH` - Biotechnology
- `PROPTECH` - Property Technology
- `SAAS` - Software as a Service
- `TRANSPORTATION` - Transportation and Mobility
- `CYBERSECURITY` - Cybersecurity
- `SOCIAL_MEDIA` - Social Media
- `ENTERTAINMENT` - Entertainment
- `GAMING` - Gaming
- `MARKETING` - Marketing
- `HRTECH` - Human Resources Technology
- `LEGALTECH` - Legal Technology
- `SUPPLYCHAIN` - Supply Chain
- `INSURTECH` - Insurance Technology
- `FOODTECH` - Food Technology
- `TRAVEL` - Travel and Tourism
- `FASHION` - Fashion
- `SPORTS` - Sports
- `FINANCIAL_SERVICES` - Financial Services
- `CONSTRUCTION` - Construction
- `HARDWARE` - Hardware
- `NONPROFIT` - Nonprofit

### Event Categories
- `CONFERENCE` - Conferences
- `APP_LAUNCH` - App Launches
- `HANGOUT` - Hangouts
- `MUSIC` - Music Events

### Fallback
- `OTHER` - Miscellaneous or unspecified categories

## Usage

### Importing Categories

```typescript
import { Category, getCategoriesForEntityType, isValidCategoryForEntityType } from '../shared/category.enum';
```

### Getting Categories for Entity Types

```typescript
// Get all categories for startups
const startupCategories = getCategoriesForEntityType('startups');

// Get categories for coworking spaces
const coworkingCategories = getCategoriesForEntityType('coWorkingSpaces');

// Get categories for training organizations
const trainingCategories = getCategoriesForEntityType('trainingOrganizations');
```

### Validating Categories

```typescript
// Check if a category is valid for a specific entity type
const isValid = isValidCategoryForEntityType(Category.STARTUP, 'startups');
```

## Adding New Categories

To add a new category:

1. Open `src/shared/category.enum.ts`
2. Add the new category to the appropriate section
3. Update the `CATEGORY_GROUPS` if needed
4. Update the `getCategoriesForEntityType` function if the category should be available for specific entity types

Example:
```typescript
// Add to the appropriate section
NEW_CATEGORY = 'New Category',

// Add to CATEGORY_GROUPS if needed
TECH_CATEGORIES: [
  // ... existing categories
  Category.NEW_CATEGORY,
],
```

## Migration

When categories are changed, existing data needs to be migrated. Use the migration script:

```bash
npm run migrate:categories
```

This script safely updates existing category data without losing any information.

## Benefits

1. **Centralized Management**: All categories are defined in one place
2. **Type Safety**: TypeScript ensures category values are valid
3. **Easy Updates**: Adding/removing categories only requires changes in one file
4. **Data Safety**: Migration scripts ensure existing data is preserved
5. **Consistency**: All entity types use the same category system

## Entity Type Mapping

Different entity types have access to different category groups:

- **Startups**: Organization Types + Tech Categories
- **Coworking Spaces**: Organization Types (specifically COWORKING_SPACE)
- **Training Organizations**: Organization Types (specifically TECH_HUB_TRAINING_CENTER)
- **Events**: Event Categories + Tech Categories
- **News Articles**: Tech Categories

This ensures that each entity type only shows relevant categories in the UI and API. 