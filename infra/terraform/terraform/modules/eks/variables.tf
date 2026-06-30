variable "cluster_name" {}

variable "cluster_role_arn" {}

variable "kubernetes_version" {}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}