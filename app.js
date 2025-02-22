import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware.js';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js'; // Import the missing router
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
try {
  await connectToDatabase();
  console.log('✅ Connected to the database');
} catch (error) {
  console.error('❌ Failed to connect to the database:', error.message);
  process.exit(1); // Exit the process if the database connection fails
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware); // Use the middleware

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// Error handling middleware
app.use(errorMiddleware);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;