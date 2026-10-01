import path from 'node:path';
import { config } from 'dotenv';

// Prisma's CLI (migrate/generate/studio) only auto-loads a .env next to
// schema.prisma. Ours lives at the repo root, alongside the client's secrets
// (see index.js, which loads it the same way for the running server).
config();
config({ path: path.join(__dirname, '..', '.env') });
