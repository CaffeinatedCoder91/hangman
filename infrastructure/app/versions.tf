terraform {
  required_version = ">= 1.10.0, < 2.0.0"

  # The bucket and state key are intentionally supplied to `terraform init`.
  # Partial backend configuration lets the same code manage test and staging
  # without hard-coding an account-specific bucket name into Git.
  backend "s3" {}

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.7, < 3.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0, < 7.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.stage
      ManagedBy   = "Terraform"
    }
  }
}
