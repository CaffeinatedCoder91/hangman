# This small configuration solves Terraform's "chicken and egg" problem: the
# main stack needs an S3 bucket before it can store state in S3. Bootstrap is
# therefore applied once with local state, after which normal app state lives
# remotely. Do not delete the local bootstrap state until its output is saved.

data "aws_caller_identity" "current" {}

locals {
  # S3 bucket names are global. Adding the AWS account ID makes this name both
  # predictable and very unlikely to collide with another person's bucket.
  state_bucket_name = "${var.project_name}-terraform-state-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = local.state_bucket_name

  # A state bucket is shared plumbing. This guard makes a casual
  # `terraform destroy` fail instead of deleting every environment's state.
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project   = var.project_name
    ManagedBy = "Terraform"
    Purpose   = "Terraform state"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  # Versioning provides a recovery path if a state object is overwritten or
  # accidentally deleted. It does not replace backups, but it is a vital layer.
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
