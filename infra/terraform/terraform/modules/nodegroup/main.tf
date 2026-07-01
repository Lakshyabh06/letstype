resource "aws_eks_node_group" "main" {

  cluster_name = var.cluster_name

  node_group_name = var.node_group_name

  node_role_arn = var.node_group_role_arn

  subnet_ids = var.subnet_ids

  scaling_config {

    desired_size = var.desired_size

    min_size = var.min_size

    max_size = var.max_size
  }

  capacity_type = "ON_DEMAND"

  instance_types = var.node_instance_types
}