# Hangman

A deliberately small, stateless Hangman learning project. It uses Node.js 22,
strict TypeScript, Express, React, Vite, styled-components, Vitest, and
Terraform.

## Architecture

The browser receives a static React application from CloudFront backed by a
private S3 bucket. It calls an Express API running in one Lambda behind an API
Gateway HTTP API. Terraform defines these AWS resources in `eu-west-2`.

There is no database or server-side game session. A challenge ID is a
non-secret lookup key for a word in `backend/src/data/words.json`. After every
turn the browser sends the complete unique list of guessed letters. The API
finds the word and recomputes the game state from that list.

## Important files

- `backend/src/data/words.json` — challenge IDs, answers, categories, and hints.
- `backend/src/game.ts` — validation and deterministic game-state calculation.
- `backend/src/app.ts` — Express routes.
- `backend/src/lambda.ts` and `backend/src/server.ts` — AWS and local entry points.
- `frontend/src/App.tsx` — the accessible React application shell.
- `infrastructure/bootstrap/` — the versioned and encrypted Terraform state bucket.
- `infrastructure/app/` — Lambda, API Gateway, S3, and CloudFront resources.
- `infrastructure/README.md` — the detailed Terraform learning walkthrough.
- `.github/workflows/ci.yml` — application checks.
- `.github/workflows/terraform.yml` — Terraform staging plan and deployment.

## Local development

Install Node.js 22, then run:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Express runs on `http://localhost:3001`; Vite
proxies `/api` and `/health` to it. Local development does not contact AWS.

Run the complete local quality gate with:

```sh
npm run check
```

It runs backend and frontend tests, strict TypeScript checks, the production
Lambda bundle and export check, and the production frontend build.

## API routes

- `GET /health` returns `{ "status": "ok" }`.
- `GET /api/challenges` returns a masked challenge with six attempts.
- `POST /api/challenges/:challengeId/guess` accepts the complete
  `guessedLetters` list and returns the recomputed game state.

Challenge IDs absent from the JSON file return `404`. Invalid letter lists
return `400`. The answer is returned only after a win or loss.

## Terraform deployment

Terraform uses two configurations with separate responsibilities:

1. `infrastructure/bootstrap` creates the shared S3 state bucket once.
2. `infrastructure/app` manages the application resources using remote state.

Read [`infrastructure/README.md`](infrastructure/README.md) before applying
anything. It explains initialization, state locking, plans, applies, frontend
publishing, repeatability checks, and removal.

For an already initialized stage, the normal manual flow is:

```sh
AWS_PROFILE=hangman-deployer npm run check
AWS_PROFILE=hangman-deployer npm run build:lambda
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app plan \
  -var-file=staging.tfvars \
  -out=staging.tfplan
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app apply staging.tfplan
AWS_PROFILE=hangman-deployer ./scripts/deploy-terraform-frontend.sh
```

Always read the saved plan before applying it. The frontend publishing script
reads Terraform outputs, builds the browser application with the deployed API
URL, uploads it to S3, and invalidates CloudFront.

## GitHub deployment flow

Pull requests run the application gate and a Terraform staging plan. A reviewed
push to `main` applies that saved plan and publishes the frontend. GitHub obtains
short-lived AWS credentials through OIDC; no long-lived access keys are stored.

The `terraform-staging` GitHub environment must define:

- `AWS_TERRAFORM_ROLE_ARN` — the AWS IAM role trusted by this repository.
- `TF_STATE_BUCKET` — the bootstrap state bucket name.

AWS identity-provider, role trust, GitHub environment, and repository variable
configuration are deliberate manual security steps.

## Previous infrastructure resources

Removing the previous infrastructure tool from this repository does not delete
resources it already created in AWS. Validate the Terraform staging deployment
and identify resource ownership before manually cleaning up any older stacks.
The Terraform state bucket is shared infrastructure and must not be destroyed
as part of ordinary application cleanup.

## Environment files

Copy `.env.example` to `.env.local` only if a local frontend build must target a
separately hosted API. Never put credentials or secrets in a Vite environment
file: values prefixed with `VITE_` are included in the browser bundle.

## Deliberate limitations

- Challenge IDs are public identifiers, not secrets.
- There is no authentication, signing, cookie, secret, database, session,
  scoreboard, or multiplayer support.
- A refresh starts a new game, and clients can submit any complete valid guess list.
- The permissive API CORS policy keeps deployment simple.
- The word list is bundled with the API and requires a deployment to change.
- The UI and API use English A–Z letters only.
