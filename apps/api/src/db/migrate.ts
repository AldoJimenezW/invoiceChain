import { initDb } from './schema';

async function migrate() {
  try {
    await initDb();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
