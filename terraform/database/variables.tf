variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "name_prefix" {
  type    = string
  default = "letstype"
}

variable "db_password" {
  type      = string
  sensitive = true
}
