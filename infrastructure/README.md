# Terraform learning deployment

This directory recreates the existing SST architecture in Terraform without
touching the SST-managed resources. It deliberately uses a separate
`terraform-test` stage first.

## Mental model

Terraform compares three things:

1. the desired resources in `.tf` files;
2. the resources recorded in Terraform state;
3. the resources currently returned by AWS APIs.

`terraform plan` shows the proposed reconciliation. `terraform apply` performs
it and updates state. Never run `apply` without reading the plan first.

The directories have separate responsibilities:

- `bootstrap/` creates the shared S3 state bucket once.
- `app/` creates Hangman's Lambda, API Gateway, S3, and CloudFront resources.
- `scripts/deploy-terraform-frontend.sh` builds and uploads browser assets after
  Terraform provides the API URL.

## Prerequisites

- Terraform 1.10 or newer (validated with Terraform 1.15.9)
- Node.js 22 or newer
- AWS CLI v2
- An authenticated `hangman-deployer` AWS profile

Confirm identity before any AWS operation:

```bash
AWS_PROFILE=hangman-deployer aws sts get-caller-identity
```

## 1. Bootstrap remote state once

Bootstrap initially uses local state because the remote bucket does not exist
yet. Its bucket has encryption, versioning, public-access blocking, and a
`prevent_destroy` guard.

```bash
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/bootstrap init
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/bootstrap plan -out=bootstrap.tfplan
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/bootstrap apply bootstrap.tfplan
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/bootstrap output -raw state_bucket_name
```

Save the output as `TF_STATE_BUCKET`. Bootstrap state is ignored by Git and must
remain protected locally because it records ownership of the state bucket.

## 2. Initialize the isolated test stage

S3-native locking creates a `.tflock` object while Terraform is changing state.
This prevents two operators or CI jobs from applying concurrently.

```bash
export TF_STATE_BUCKET="replace-with-bootstrap-output"

AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=hangman/terraform-test/terraform.tfstate" \
  -backend-config="region=eu-west-2" \
  -backend-config="encrypt=true" \
  -backend-config="use_lockfile=true"
```

## 3. Build, plan, and apply infrastructure

The Lambda ZIP must exist before Terraform can calculate its content hash.
The bundle uses CommonJS because `@codegenie/serverless-express` dynamically
loads Node built-ins with `require`; packaging that dependency as pure ESM would
make Lambda fail during initialization before Express receives a request.

```bash
npm run check
npm run build:lambda

AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app fmt -check
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app validate
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app plan \
  -var-file=terraform-test.tfvars \
  -out=terraform-test.tfplan
```

Read the plan. It must create only resources named `hangman-terraform-test-*`.
Applying is a separate, deliberate step:

```bash
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app apply terraform-test.tfplan
```

## 4. Build and upload the frontend

```bash
AWS_PROFILE=hangman-deployer ./scripts/deploy-terraform-frontend.sh
terraform -chdir=infrastructure/app output
```

Test `api_url/health`, `api_url/api/challenges`, and the printed `web_url`.

## 5. Prove repeatability

After deployment, rebuild Lambda and run another plan:

```bash
npm run build:lambda
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app plan \
  -var-file=terraform-test.tfvars
```

A stable configuration should report that no infrastructure changes are
needed. Frontend object contents are deployed separately and are not part of
Terraform state.

## GitHub Actions prerequisites

The workflow never stores AWS access keys. A repository administrator must
manually configure:

1. an AWS IAM OIDC provider for `token.actions.githubusercontent.com`;
2. an IAM role trusted by this repository and restricted to the staging GitHub
   environment;
3. repository variable `AWS_TERRAFORM_ROLE_ARN` containing that role ARN;
4. repository variable `TF_STATE_BUCKET` containing the bootstrap bucket name;
5. a protected GitHub environment named `terraform-staging`.

These are intentional manual steps: this repository must not silently alter
AWS identity or GitHub security settings.

## Removal

Only remove the isolated test stage after checking the selected state key:

```bash
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app plan \
  -destroy -var-file=terraform-test.tfvars
AWS_PROFILE=hangman-deployer terraform -chdir=infrastructure/app destroy \
  -var-file=terraform-test.tfvars
```

Do not remove SST staging until the Terraform staging deployment has passed all
smoke tests. Do not attempt to destroy the shared bootstrap bucket.
