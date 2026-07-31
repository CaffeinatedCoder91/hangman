import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("Hangman API", () => {
  it("starts a hidden game with six attempts", async () => {
    const response = await request(app).get("/api/challenges").expect(200);

    expect(response.body).toMatchObject({
      attemptsRemaining: 6,
      guessedLetters: [],
      missedLetters: [],
      status: "playing"
    });
    expect(response.body.maskedWord).toMatch(/^_+$/);
    expect(response.body).not.toHaveProperty("answer");
  });

  it("updates correct and incorrect guesses", async () => {
    const correct = await request(app)
      .post("/api/challenges/planet-amber/guess")
      .send({ guessedLetters: ["S"] })
      .expect(200);
    expect(correct.body).toMatchObject({
      maskedWord: "S_____",
      attemptsRemaining: 6,
      missedLetters: []
    });

    const incorrect = await request(app)
      .post("/api/challenges/planet-amber/guess")
      .send({ guessedLetters: ["S", "X"] })
      .expect(200);
    expect(incorrect.body).toMatchObject({
      maskedWord: "S_____",
      attemptsRemaining: 5,
      missedLetters: ["X"],
      status: "playing"
    });
  });

  it("reveals the answer when the word is completed", async () => {
    const response = await request(app)
      .post("/api/challenges/planet-amber/guess")
      .send({ guessedLetters: ["S", "A", "T", "U", "R", "N"] })
      .expect(200);

    expect(response.body).toMatchObject({
      maskedWord: "SATURN",
      answer: "SATURN",
      status: "won"
    });
  });

  it("rejects an unknown challenge ID", async () => {
    await request(app)
      .post("/api/challenges/not-a-word/guess")
      .send({ guessedLetters: [] })
      .expect(404, { error: "Challenge not found" });
  });

  it("reveals the answer after six incorrect guesses", async () => {
    const response = await request(app)
      .post("/api/challenges/planet-amber/guess")
      .send({ guessedLetters: ["B", "C", "D", "E", "F", "G"] })
      .expect(200);

    expect(response.body).toMatchObject({
      attemptsRemaining: 0,
      missedLetters: ["B", "C", "D", "E", "F", "G"],
      status: "lost",
      answer: "SATURN"
    });
  });

  it("rejects invalid guessed-letter lists", async () => {
    for (const guessedLetters of [["s"], ["S", "S"], ["12"], "S"]) {
      await request(app)
        .post("/api/challenges/planet-amber/guess")
        .send({ guessedLetters })
        .expect(400);
    }
  });
});
