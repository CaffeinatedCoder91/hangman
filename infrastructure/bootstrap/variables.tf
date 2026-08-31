variable "aws_region" {
  description = "AWS region that stores Terraform's shared state bucket."
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Short name used when naming the shared Terraform state bucket."
  type        = string
  default     = "hangman"
}
