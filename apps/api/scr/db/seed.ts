import { seedDb } from './schema';

async function seed() {
  try {
    await seedDb();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
