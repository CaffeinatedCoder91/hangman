// Import the configure function from the @codegenie/serverless-express package, it acts like a translator between AWS Lambda and the Express app.
//Allow the express app to be run in a serverless environment, such as AWS Lambda, by wrapping the express app with the configure function. This allows the express app to handle incoming requests and generate appropriate responses in a serverless context.
import { configure } from '@codegenie/serverless-express';
// Import the express app from the app.ts file, which contains the API endpoints and game logic.
import { app } from './app.js';
//calling the configure function, passing in the Express app as an argument and exports the result as handler.
export const handler = configure({ app });
