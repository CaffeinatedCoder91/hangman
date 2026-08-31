#!/usr/bin/env bash

# Deploy the browser application after Terraform has created its infrastructure.
# Keeping asset deployment in a script makes the sequence explicit:
#   1. read Terraform outputs;
#   2. build Vite with the correct API URL;
#   3. synchronize immutable files to private S3;
#   4. invalidate CloudFront so index.html updates promptly.

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
terraform_directory="${repository_root}/infrastructure/app"

# `terraform output -raw` avoids JSON quotes and gives the exact value expected
# by Vite and the AWS CLI. Terraform must already be initialized and applied.
api_url="$(terraform -chdir="${terraform_directory}" output -raw api_url)"
bucket_name="$(terraform -chdir="${terraform_directory}" output -raw web_bucket_name)"
distribution_id="$(terraform -chdir="${terraform_directory}" output -raw cloudfront_distribution_id)"

echo "Building the frontend for API ${api_url}"
VITE_API_URL="${api_url}" npm --prefix "${repository_root}" run build

# --delete is important for Vite's hashed filenames: it removes superseded
# bundles rather than accumulating every historical build in the bucket.
aws s3 sync "${repository_root}/frontend/dist" "s3://${bucket_name}" --delete

# CloudFront may still cache index.html after S3 changes. One wildcard
# invalidation keeps this learning project predictable after each deployment.
aws cloudfront create-invalidation \
  --distribution-id "${distribution_id}" \
  --paths "/*"

echo "Frontend deployment submitted. CloudFront invalidation may take a few minutes."
