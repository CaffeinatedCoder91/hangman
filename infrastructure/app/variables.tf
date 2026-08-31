variable "aws_region" {
  description = "AWS region for the regional resources. CloudFront remains global."
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Stable application name used as an AWS resource-name prefix."
  type        = string
  default     = "hangman"
}

variable "stage" {
  description = "Isolated environment name, for example terraform-test or staging."
  type        = string
  default     = "terraform-test"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.stage))
    error_message = "stage must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "log_retention_days" {
  description = "Days to keep Lambda and API logs before CloudWatch expires them."
  type        = number
  default     = 14
}
