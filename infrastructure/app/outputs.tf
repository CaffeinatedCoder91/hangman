output "api_url" {
  description = "Public API Gateway URL baked into the frontend build."
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "web_url" {
  description = "Public CloudFront URL for the deployed React application."
  value       = "https://${aws_cloudfront_distribution.web.domain_name}"
}

output "web_bucket_name" {
  description = "Private S3 bucket targeted by the frontend deployment script."
  value       = aws_s3_bucket.web.id
}

output "cloudfront_distribution_id" {
  description = "Distribution invalidated after new frontend files are uploaded."
  value       = aws_cloudfront_distribution.web.id
}
