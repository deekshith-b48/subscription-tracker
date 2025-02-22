import { config } from 'dotenv';
import { existsSync } from 'fs';

// Determine the environment file to load
const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;

// Load environment variables from the appropriate file
if (existsSync(envFile)) {
  config({ path: envFile });
  console.log('Loaded ENV file:', envFile);
} else {
  config(); // Load default .env file
  console.log('Loaded default ENV file: .env');
}

// Validate required environment variables
const requiredEnvVars = ['PORT', 'DB_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Log environment variables for debugging
console.log('PORT from ENV:', process.env.PORT);
console.log('DB_URI from ENV:', process.env.DB_URI);
console.log('NODE_ENV from ENV:', process.env.NODE_ENV);

// Export environment variables
export const { PORT, DB_URI, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN,ARCJET_KEY,ARCJET_ENV,QSTASH_TOKEN,QSTASH_URL,EMAIL_PASSWORD } = process.env;