# Hangman

A deliberately small, stateless Hangman learning project. It uses Node.js 22, strict TypeScript, Express, React, Vite, styled-components, Vitest, and SST.

## Architecture

The browser receives a static React application from CloudFront backed by S3. It calls an Express API running in one Lambda behind an API Gateway HTTP API. Both are deployed in `eu-west-2`.

There is no database or server-side game session. A challenge ID is a non-secret lookup key for a word in `backend/src/data/words.json`. After every turn the browser sends the complete unique list of guessed letters. The API finds the word, recomputes its mask and missed letters, and derives the status. This is intentionally suitable for learning, not for competitive play: someone can inspect the source bundle or API behavior, and progress is not persisted.

## Important files

- `backend/src/data/words.json` — challenge IDs, answers, categories, and hints.
- `backend/src/game.ts` — validation and deterministic game-state calculation.
- `backend/src/app.ts` — Express routes.
- `backend/src/lambda.ts` and `backend/src/server.ts` — AWS Lambda and local entry points.
- `frontend/src/App.tsx` — the single accessible React page.
- `sst.config.ts` — API Gateway, Lambda, S3, and CloudFront infrastructure.
- `infrastructure/README.md` — commented parallel Terraform migration and learning walkthrough.
- `.github/workflows/ci.yml` — pull-request checks and main-branch deployment.

## Local development

Install Node.js 22, then:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Express runs on `http://localhost:3001`; Vite proxies `/api` and `/health` to it. This command is entirely local and does not use AWS.

Run the complete local gate with:

```sh
npm run check
```

It runs the test suites, strict TypeScript checks for the backend, frontend,
and SST configuration, and the production Vite build.

## Terraform learning migration

The repository also contains a parallel Terraform implementation under
`infrastructure/`. It creates an isolated `terraform-test` environment and does
not import, update, or replace the resources currently managed by SST. Start
with [`infrastructure/README.md`](infrastructure/README.md); it explains remote
state, planning, applying, frontend publishing, CI authentication, and safe
removal step by step.

## API routes

- `GET /health` returns `{ "status": "ok" }`.
- `GET /api/challenges` chooses a random configured word and returns a fully masked challenge with six attempts.
- `POST /api/challenges/:challengeId/guess` accepts `{ "guessedLetters": ["a", "b"] }`. Letters must be unique single A–Z characters. The answer is omitted while playing and included only after a win or loss.

Challenge IDs absent from the JSON file return `404`. Invalid letter lists return `400`.

## AWS account setup

Do these steps yourself; no account changes are made by this repository:

1. Choose or create an AWS account and enable billing alerts/budgets.
2. Install and authenticate the AWS CLI with an administrator/bootstrap identity.
3. Confirm that the target region is London (`eu-west-2`).
4. From this repository, run `npx sst install` once to download SST's local
   providers and generate its TypeScript platform declarations.
5. Review the preview and expected AWS charges before deploying.

SST creates and manages the Lambda, API Gateway HTTP API, S3 bucket, CloudFront distribution, deployment assets, and supporting roles/state. AWS services can incur charges.

## Staging deployment

With the temporary `hangman-deployer` AWS profile selected in your terminal:

```sh
export AWS_PROFILE=hangman-deployer
npm run check
npm run deploy:staging
```

SST uses the credentials active in your terminal and prints the API and website
URLs. It passes the API URL to the frontend build as `VITE_API_URL`. The
`staging` stage creates resources separate from `production`.

## Production flow

After verifying staging, deploy the independent production stage from your
authenticated terminal:

```sh
npm run check
npm run deploy:production
```

Production resources are protected and retained by default. This learning
setup uses manual deployments only; it does not configure GitHub Actions or
GitHub OIDC deployment access.

## Cleanup

Remove staging resources with:

```sh
npm run remove:staging
```

Production is protected. If removal is genuinely intended, first change the production `protect` and `removal` settings in `sst.config.ts`, deploy that configuration, and then run `npm run remove:production`. Check the AWS consoles afterward for retained data or bootstrap resources before closing an account.

## Environment files

Copy `.env.example` to `.env.local` only if a local frontend build must target
a separately hosted API. Do not put credentials or secrets in a Vite
environment file: values prefixed with `VITE_` are included in the browser
bundle. The normal `npm run dev` flow leaves this unset and uses Vite's local
proxy instead.

## Deliberate limitations

- Challenge IDs are public identifiers, not secrets.
- There is no authentication, signing, cookie, secret, database, session, scoreboard, or multiplayer support.
- A refresh starts a new game, and clients can submit any complete valid guess list.
- The permissive API CORS policy keeps deployment simple.
- The eight-word JSON list is bundled with the API and requires a deployment to change.
- The UI and API use English A–Z letters only.
