variable "cluster_name" {}

variable "node_group_name" {}

variable "node_group_role_arn" {}

variable "desired_size" {}

variable "min_size" {}

variable "max_size" {}

variable "subnet_ids" {
  type = list(string)
}

variable "node_instance_types" {
  type = list(string)
}