// This line gives your editor and TypeScript the type definitions for SST's
// global objects, like `$config`, `sst`, and `$app`. Without it, the code
// below wouldn't autocomplete or typecheck. It doesn't run any code itself.
/// <reference path="./.sst/platform/config.d.ts" />

// SST bootstrap (not declared anywhere in this file):
// The very first time you deploy to a given AWS account and region, SST
// automatically creates some shared infrastructure of its own, before it
// creates any of the resources below. You won't see this in the code
// because it isn't part of your app — it's plumbing SST needs to manage
// any app. It includes:
//   - An S3 bucket holding SST's own state (a record of what SST is
//     currently managing for you).
//   - An S3 bucket for build assets, like your Lambda's zipped code.
//   - An ECR (container image) repository, kept ready in case an app in
//     this account ever deploys a container — this app doesn't use one.
//   - An SSM Parameter (`/sst/bootstrap`) recording the names of the
//     above, so future deploys know where to find them.
//   - SST "Live" resources, only if that dev feature is used.
// These bootstrap resources are shared across every SST app and stage in
// the account/region — not just this one. Because of that, running
// `sst remove` on this app never deletes them; they're left alone so other
// apps/stages relying on them keep working.

// $config is the function SST expects you to export. It takes one object
// with two parts: `app`, which describes the app's identity and safety
// settings, and `run`, which is where you actually declare AWS resources.
export default $config({
  // app() runs once per command (deploy, dev, remove) and returns settings
  // that apply to the whole app for whichever stage you're targeting.
  // `input` tells you which stage is being used, so you can change settings
  // per stage (e.g. protect production, but not staging).
  app(input) {
    return {
      // The app's name. SST uses this as a prefix/namespace when naming the
      // real AWS resources it creates, so this app's resources don't collide
      // with a different app in the same AWS account.
      name: "hangman",

      // What happens to resources when you run `sst remove` for this stage.
      // "retain" means AWS keeps the resource even after SST stops managing
      // it (used for production, so a mistaken removal doesn't delete real
      // data). "remove" means it's actually deleted (fine for staging, which
      // is meant to be disposable).
      removal: input?.stage === "production" ? "retain" : "remove",

      // Whether this stage is protected from `sst remove` entirely. When
      // true, SST refuses to remove the stage unless you deliberately turn
      // this off first and redeploy. Only production is protected, so a
      // fat-fingered `sst remove` can't take the real app down.
      protect: input?.stage === "production",

      // Which cloud this app deploys to. "aws" tells SST to use its AWS
      // components and talk to AWS's APIs.
      home: "aws",

      providers: {
        // Configures the AWS provider SST uses under the hood. Setting the
        // region here means every AWS resource this app creates — the API,
        // the Lambda function, the S3 buckets, CloudFront — is created in
        // eu-west-2 (London) unless a resource says otherwise.
        aws: { region: "eu-west-2" }
      }
    };
  },

  // run() is where you actually declare AWS resources: the API, the
  // website, and anything else this app needs. It's kept separate from
  // app() because app() only decides settings, while run() does the real
  // work of building the infrastructure using those settings.
  async run() {
    // sst.aws.ApiGatewayV2 is a high-level SST "component" — a convenience
    // wrapper, not a single raw AWS resource. Creating this one line
    // actually creates: an API Gateway v2 HTTP API, an API Gateway stage,
    // a CloudWatch Log Group for access logs, and a public "execute-api"
    // URL. The `cors` block controls which websites are allowed to make
    // requests to this API. CORS is enforced by browsers, not the server —
    // it is not authentication or a security boundary against non-browser
    // clients. There's no authorizer configured here, so this API is
    // public: anyone with the URL can call it.
    const api = new sst.aws.ApiGatewayV2("HangmanApi", {
      cors: {
        allowHeaders: ["content-type"],
        allowMethods: ["GET", "POST"],
        allowOrigins: ["*"]
      }
    });

    // api.route() is also a convenience method that wires up several
    // resources at once: the Lambda function itself, an IAM role the
    // Lambda runs as (separate from your own admin AWS identity — this
    // role only gets whatever permissions it actually needs at runtime,
    // which for this app is none beyond writing its own logs), a
    // CloudWatch Log Group for the Lambda's logs, an API Gateway route,
    // the integration connecting that route to the Lambda, a resource
    // policy permitting API Gateway to invoke the Lambda, and uploading
    // the Lambda's code to SST's shared asset bucket.
    //
    // "$default" is a catch-all route: every request, regardless of path
    // or method, is sent to this one Lambda. API Gateway does no
    // path-based routing itself — it just invokes Lambda, which hands the
    // request to Express, and Express does the actual route matching
    // (GET /health, POST /api/challenges/:id/guess, etc.), exactly like it
    // would if you were running it locally.
    api.route("$default", {
      handler: "backend/src/lambda.handler",
      runtime: "nodejs22.x"
    });

    // sst.aws.StaticSite builds and hosts the frontend. It runs the given
    // build command, then creates: a private S3 bucket to hold the built
    // files (not publicly reachable on its own — S3's public access is
    // explicitly blocked), a bucket policy that allows CloudFront, and a
    // CloudFront distribution that reads from that S3 bucket and serves
    // users a cached, fast copy of the site from a location near them.
    // SST also gives you a generated *.cloudfront.net URL for it. No custom
    // domain, no Route 53 DNS zone, and no HTTPS certificate are set up —
    // this is the default AWS-provided address only.
    const web = new sst.aws.StaticSite("HangmanWeb", {
      path: ".",
      build: {
        command: "npm run build",
        output: "frontend/dist"
      },
      // Vite bakes any environment variable starting with VITE_ directly
      // into the browser JavaScript bundle at build time. That means
      // VITE_API_URL — and anything else prefixed VITE_ — is visible to
      // anyone who opens the site and looks at the served files. Treat it
      // as public information. Never put secrets or credentials in a
      // Vite/frontend environment variable.
      environment: {
        VITE_API_URL: api.url
      }
    });

    // Values returned from run() do not create or change any AWS
    // resources — they're just printed to your terminal after a deploy,
    // and also saved to .sst/outputs.json, so you (or a script) can read
    // the deployed URLs afterward.
    return { api: api.url, web: web.url };
  }
});
