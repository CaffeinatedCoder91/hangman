//allow browsers on other origns to read responses from this server
import cors from 'cors';
//used to build  the API, handles routing, requests and responses
import express from 'express';
//import functions from game.js to handle the game logic
import { newChallenge, playChallenge, validateGuesses } from './game.js';
//create an instance of express to handle requests and responses
export const app = express();
//use cors middleware to allow cross-origin requests and express.json middleware to parse incoming JSON requests
app.use(cors());
// use express.json middleware to parse incoming JSON requests
app.use(express.json());
//GET endpoint to check the health of the server, responds with a JSON object indicating the status is 'ok'
app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});
//GET endpoint to create a new challenge, responds with a JSON object containing the new challenge
app.get('/api/challenges', (_request, response) => {
  response.json(newChallenge());
});
//POST endpoint to make a guess for a specific challenge, validates the guessed letters and responds with the updated challenge or an error message
//IF not guessedLetters is valid, responds with a 400 status code and an error message
//IF the challenge is not found, responds with a 404 status code and an error message
app.post('/api/challenges/:challengeId/guess', (request, response) => {
  const guessedLetters = validateGuesses(request.body?.guessedLetters);
  if (!guessedLetters) {
    response
      .status(400)
      .json({ error: 'guessedLetters must be a unique list of A-Z letters' });
    return;
  }
//
  const challenge = playChallenge(request.params.challengeId, guessedLetters);
  if (!challenge) {
    response.status(404).json({ error: 'Challenge not found' });
    return;
  }
//responds with the updated challenge object in JSON format
  response.json(challenge);
});
