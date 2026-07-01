resource "aws_eks_cluster" "main" {

  name     = var.cluster_name
  role_arn = var.cluster_role_arn

  version = var.kubernetes_version

  access_config {
    authentication_mode                         = "API_AND_CONFIG_MAP"
    bootstrap_cluster_creator_admin_permissions = true
  }

  vpc_config {

    subnet_ids = var.subnet_ids

    security_group_ids = var.security_group_ids

    endpoint_private_access = true
    endpoint_public_access  = true
  }
}