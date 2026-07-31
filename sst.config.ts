/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hangman",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
      providers: {
        aws: { region: "eu-west-2" }
      }
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2("HangmanApi", {
      cors: {
        allowHeaders: ["content-type"],
        allowMethods: ["GET", "POST"],
        allowOrigins: ["*"]
      }
    });

    api.route("$default", {
      handler: "backend/src/lambda.handler",
      runtime: "nodejs22.x"
    });

    const web = new sst.aws.StaticSite("HangmanWeb", {
      path: ".",
      build: {
        command: "npm run build",
        output: "frontend/dist"
      },
      environment: {
        VITE_API_URL: api.url
      }
    });

    return { api: api.url, web: web.url };
  }
});
