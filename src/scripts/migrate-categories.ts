// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Category } from '../shared/category.enum';

// /**
//  * Migration script to update existing category data to use new centralized categories
//  * 
//  * This script safely migrates existing data without losing any information.
//  * It maps old category values to new ones and preserves all other data.
//  */
// async function migrateCategories() {
//   const app = await NestFactory.createApplicationContext(AppModule);

//   console.log('Starting category migration...');

//   try {
//     // Get all unified entities
//     console.log(`Found ${entities.length} entities to migrate`);

//     let updatedCount = 0;
//     let skippedCount = 0;

//     for (const entity of entities) {
//       let needsUpdate = false;
//       let oldCategory = entity.category;
//       let newCategory = entity.category;

//       // Map old category values to new ones
//       if (oldCategory) {
//         switch (oldCategory) {
//           // Map old tech categories to new ones
//           case 'FinTech':
//             newCategory = Category.FINTECH;
//             needsUpdate = true;
//             break;
//           case 'EdTech':
//             newCategory = Category.EDTECH;
//             needsUpdate = true;
//             break;
//           case 'Healthcare':
//             newCategory = Category.HEALTHCARE;
//             needsUpdate = true;
//             break;
//           case 'E-Commerce':
//             newCategory = Category.ECOMMERCE;
//             needsUpdate = true;
//             break;
//           case 'Artificial Intelligence':
//             newCategory = Category.AI;
//             needsUpdate = true;
//             break;
//           case 'Internet of Things':
//             newCategory = Category.IOT;
//             needsUpdate = true;
//             break;
//           case 'AgriTech':
//             newCategory = Category.AGRITECH;
//             needsUpdate = true;
//             break;
//           case 'GreenTech':
//             newCategory = Category.GREENTECH;
//             needsUpdate = true;
//             break;
//           case 'BioTech':
//             newCategory = Category.BIOTECH;
//             needsUpdate = true;
//             break;
//           case 'PropTech':
//             newCategory = Category.PROPTECH;
//             needsUpdate = true;
//             break;
//           case 'SaaS':
//             newCategory = Category.SAAS;
//             needsUpdate = true;
//             break;
//           case 'Transportation':
//             newCategory = Category.TRANSPORTATION;
//             needsUpdate = true;
//             break;
//           case 'Cybersecurity':
//             newCategory = Category.CYBERSECURITY;
//             needsUpdate = true;
//             break;
//           case 'Social Media':
//             newCategory = Category.SOCIAL_MEDIA;
//             needsUpdate = true;
//             break;
//           case 'Entertainment':
//             newCategory = Category.ENTERTAINMENT;
//             needsUpdate = true;
//             break;
//           case 'Gaming':
//             newCategory = Category.GAMING;
//             needsUpdate = true;
//             break;
//           case 'Marketing':
//             newCategory = Category.MARKETING;
//             needsUpdate = true;
//             break;
//           case 'HRTech':
//             newCategory = Category.HRTECH;
//             needsUpdate = true;
//             break;
//           case 'LegalTech':
//             newCategory = Category.LEGALTECH;
//             needsUpdate = true;
//             break;
//           case 'Supply Chain':
//             newCategory = Category.SUPPLYCHAIN;
//             needsUpdate = true;
//             break;
//           case 'InsurTech':
//             newCategory = Category.INSURTECH;
//             needsUpdate = true;
//             break;
//           case 'FoodTech':
//             newCategory = Category.FOODTECH;
//             needsUpdate = true;
//             break;
//           case 'Travel':
//             newCategory = Category.TRAVEL;
//             needsUpdate = true;
//             break;
//           case 'Fashion':
//             newCategory = Category.FASHION;
//             needsUpdate = true;
//             break;
//           case 'Sports':
//             newCategory = Category.SPORTS;
//             needsUpdate = true;
//             break;
//           case 'Financial Services':
//             newCategory = Category.FINANCIAL_SERVICES;
//             needsUpdate = true;
//             break;
//           case 'Construction':
//             newCategory = Category.CONSTRUCTION;
//             needsUpdate = true;
//             break;
//           case 'Hardware':
//             newCategory = Category.HARDWARE;
//             needsUpdate = true;
//             break;
//           case 'Nonprofit':
//             newCategory = Category.NONPROFIT;
//             needsUpdate = true;
//             break;
//           case 'Music':
//             newCategory = Category.MUSIC;
//             needsUpdate = true;
//             break;
//           case 'Conference':
//             newCategory = Category.CONFERENCE;
//             needsUpdate = true;
//             break;
//           case 'App Lauch': // Fix typo
//             newCategory = Category.APP_LAUNCH;
//             needsUpdate = true;
//             break;
//           case 'Hangout':
//             newCategory = Category.HANGOUT;
//             needsUpdate = true;
//             break;
//           case 'Other':
//             newCategory = Category.OTHER;
//             needsUpdate = true;
//             break;
//           default:
//             // If the category is already in the new format, skip it
//             if (Object.values(Category).includes(oldCategory as Category)) {
//               console.log(`Skipping entity ${entity.id} - category "${oldCategory}" is already in new format`);
//               skippedCount++;
//               continue;
//             } else {
//               // If it's an unknown category, map to OTHER
//               console.log(`Mapping unknown category "${oldCategory}" to OTHER for entity ${entity.id}`);
//               newCategory = Category.OTHER;
//               needsUpdate = true;
//             }
//         }
//       }

//       if (needsUpdate) {
//         entity.category = newCategory;
//         await unifiedEntityRepository.save(entity);
//         console.log(`Updated entity ${entity.id}: "${oldCategory}" -> "${newCategory}"`);
//         updatedCount++;
//       } else {
//         skippedCount++;
//       }
//     }

//     console.log(`\nMigration completed successfully!`);
//     console.log(`Updated: ${updatedCount} entities`);
//     console.log(`Skipped: ${skippedCount} entities`);
//     console.log(`Total processed: ${entities.length} entities`);

//   } catch (error) {
//     console.error('Migration failed:', error);
//     throw error;
//   } finally {
//     await app.close();
//   }
// }

// // Run the migration if this script is executed directly
// if (require.main === module) {
//   migrateCategories()
//     .then(() => {
//       console.log('Migration script completed');
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error('Migration script failed:', error);
//       process.exit(1);
//     });
// }

// export { migrateCategories }; 