variable "name_prefix" {
  type    = string
  default = "letstype"
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "db_password" {
  type = string
}
