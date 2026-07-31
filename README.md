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

With suitable local AWS credentials:

```sh
npm run check
npm run deploy:staging
```

SST prints the API and website URLs. The frontend build receives the deployed API URL as `VITE_API_URL`.

## GitHub OIDC setup

No long-lived AWS access keys are needed or expected.

1. In AWS IAM, add the GitHub Actions OIDC provider `token.actions.githubusercontent.com` with audience `sts.amazonaws.com` if the account does not already have it.
2. Create an IAM deployment role with a trust policy restricted to this repository. Use a subject such as `repo:OWNER/REPOSITORY:ref:refs/heads/main`; avoid trusting every repository or branch.
3. Attach permissions sufficient for SST's bootstrap and the resources in `sst.config.ts`. Start from SST's documented deploy permissions and narrow them after observing actual usage.
4. In the GitHub repository, create an Actions **variable** named `AWS_DEPLOY_ROLE_ARN` containing that role's ARN. It is an identifier, not an access key.
5. Protect `main`, require the `check` job, and restrict who can modify workflows.

The workflow grants `id-token: write` only to the deploy job. `aws-actions/configure-aws-credentials` exchanges the GitHub identity token for temporary AWS credentials.

## Production flow

Pull requests run `npm ci`, `npx sst install`, and `npm run check`. A push to `main` repeats those checks, assumes the AWS deployment role through OIDC, and runs `sst deploy --stage production`. Production resources are protected and retained by default.

The fresh-runner `npx sst install` step generates `.sst/platform/config.d.ts` before typechecking the SST configuration.

## Cleanup

Remove staging resources with:

```sh
npm run remove:staging
```

Production is protected. If removal is genuinely intended, first change the production `protect` and `removal` settings in `sst.config.ts`, deploy that configuration, and then run `npm run remove:production`. Check the AWS consoles afterward for retained data or bootstrap resources before closing an account.

## Deliberate limitations

- Challenge IDs are public identifiers, not secrets.
- There is no authentication, signing, cookie, secret, database, session, scoreboard, or multiplayer support.
- A refresh starts a new game, and clients can submit any complete valid guess list.
- The permissive API CORS policy keeps deployment simple.
- The eight-word JSON list is bundled with the API and requires a deployment to change.
- The UI and API use English A–Z letters only.
