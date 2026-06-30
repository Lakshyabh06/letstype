terraform {
  backend "s3" {
    bucket         = "letstype-terraform-state"
    key            = "terraform/platform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "letstype-terraform-lock"
    encrypt        = true
  }
}
