// Import the express app from the app.ts file, which contains the API endpoints and game logic.
import { app } from './app.js';
// Get the port number from the environment variable PORT, or default to 3001 if not set. The Number function is used to convert the string value of the environment variable to a number.
const port = Number(process.env.PORT ?? 3001);
// Start the Express server and listen for incoming requests on the specified port. When the server starts successfully, it logs a message to the console indicating that the Hangman API is listening on the specified URL.
app.listen(port, () => {
  console.log(`Hangman API listening on http://localhost:${port}`);
});
