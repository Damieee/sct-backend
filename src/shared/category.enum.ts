/**
 * Centralized Category Enum
 * 
 * This enum contains all categories used across the application.
 * When adding or removing categories, only update this file.
 * All other files will automatically use the updated categories.
 * 
 * Categories are based on the organizations.csv file and UI requirements.
 */
export enum Category {
  // Organization Types (from CSV)
  STARTUP = 'Startup',
  TECH_HUB_TRAINING_CENTER = 'Tech hub/training center',
  COWORKING_SPACE = 'Coworking Space',
  TECH_COMMUNITY = 'Tech Community',
  INNOVATION_LAB_ACCELERATOR = 'Innovation Lab/Accelerator',
  BUSINESS_SUPPORT_DIGITAL_SERVICES = 'Business Support/Digital Services',
  DEVELOPMENT_PARTNER = 'Development Partner',
  GOVERNMENT_ORG_AGENCY = 'Government Org/Agency',

  // Tech Categories (for startups and other entities)
  FINTECH = 'FinTech',
  EDTECH = 'EdTech',
  HEALTHCARE = 'Healthcare',
  ECOMMERCE = 'E-Commerce',
  AI = 'Artificial Intelligence',
  IOT = 'Internet of Things',
  AGRITECH = 'AgriTech',
  GREENTECH = 'GreenTech',
  BIOTECH = 'BioTech',
  PROPTECH = 'PropTech',
  SAAS = 'SaaS',
  TRANSPORTATION = 'Transportation',
  CYBERSECURITY = 'Cybersecurity',
  SOCIAL_MEDIA = 'Social Media',
  ENTERTAINMENT = 'Entertainment',
  GAMING = 'Gaming',
  MARKETING = 'Marketing',
  HRTECH = 'HRTech',
  LEGALTECH = 'LegalTech',
  SUPPLYCHAIN = 'Supply Chain',
  INSURTECH = 'InsurTech',
  FOODTECH = 'FoodTech',
  TRAVEL = 'Travel',
  FASHION = 'Fashion',
  SPORTS = 'Sports',
  FINANCIAL_SERVICES = 'Financial Services',
  CONSTRUCTION = 'Construction',
  HARDWARE = 'Hardware',
  NONPROFIT = 'Nonprofit',

  // Event Categories
  CONFERENCE = 'Conference',
  APP_LAUNCH = 'App Launch',
  HANGOUT = 'Hangout',
  MUSIC = 'Music',

  // Fallback
  OTHER = 'Other',
}

/**
 * Category Groups for different entity types
 */
export const CATEGORY_GROUPS = {
  ORGANIZATION_TYPES: [
    Category.STARTUP,
    Category.TECH_HUB_TRAINING_CENTER,
    Category.COWORKING_SPACE,
    Category.TECH_COMMUNITY,
    Category.INNOVATION_LAB_ACCELERATOR,
    Category.BUSINESS_SUPPORT_DIGITAL_SERVICES,
    Category.DEVELOPMENT_PARTNER,
    Category.GOVERNMENT_ORG_AGENCY,
  ],
  
  TECH_CATEGORIES: [
    Category.FINTECH,
    Category.EDTECH,
    Category.HEALTHCARE,
    Category.ECOMMERCE,
    Category.AI,
    Category.IOT,
    Category.AGRITECH,
    Category.GREENTECH,
    Category.BIOTECH,
    Category.PROPTECH,
    Category.SAAS,
    Category.TRANSPORTATION,
    Category.CYBERSECURITY,
    Category.SOCIAL_MEDIA,
    Category.ENTERTAINMENT,
    Category.GAMING,
    Category.MARKETING,
    Category.HRTECH,
    Category.LEGALTECH,
    Category.SUPPLYCHAIN,
    Category.INSURTECH,
    Category.FOODTECH,
    Category.TRAVEL,
    Category.FASHION,
    Category.SPORTS,
    Category.FINANCIAL_SERVICES,
    Category.CONSTRUCTION,
    Category.HARDWARE,
    Category.NONPROFIT,
  ],
  
  EVENT_CATEGORIES: [
    Category.CONFERENCE,
    Category.APP_LAUNCH,
    Category.HANGOUT,
    Category.MUSIC,
  ],
} as const;

/**
 * Helper function to get categories for a specific entity type
 */
export function getCategoriesForEntityType(entityType: string): Category[] {
  switch (entityType) {
    case 'startups':
      return [...CATEGORY_GROUPS.ORGANIZATION_TYPES, ...CATEGORY_GROUPS.TECH_CATEGORIES];
    case 'coWorkingSpaces':
      return [Category.COWORKING_SPACE];
    case 'trainingOrganizations':
      return [Category.TECH_HUB_TRAINING_CENTER];
    case 'events':
      return [...CATEGORY_GROUPS.EVENT_CATEGORIES, ...CATEGORY_GROUPS.TECH_CATEGORIES];
    case 'newsArticles':
      return [...CATEGORY_GROUPS.TECH_CATEGORIES];
    default:
      return Object.values(Category);
  }
}

/**
 * Helper function to check if a category is valid for an entity type
 */
export function isValidCategoryForEntityType(category: Category, entityType: string): boolean {
  const validCategories = getCategoriesForEntityType(entityType);
  return validCategories.includes(category);
} 