output "state_bucket_name" {
  description = "Pass this value to terraform init for the main application stack."
  value       = aws_s3_bucket.terraform_state.id
}
