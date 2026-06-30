data "terraform_remote_state" "foundation" {
  backend = "s3"

  config = {
    bucket = "letstype-terraform-state"
    key    = "terraform/foundation.tfstate"
    region = "us-east-1"
  }
}

module "eks" {
  source = "../modules/eks"

  cluster_name       = "${var.name_prefix}-eks"
  kubernetes_version = var.eks_version
  subnet_ids         = data.terraform_remote_state.foundation.outputs.private_subnet_ids
  security_group_ids = [data.terraform_remote_state.foundation.outputs.eks_sg_id]
  cluster_role_arn   = data.terraform_remote_state.foundation.outputs.eks_cluster_role_arn
}

module "nodegroup" {
  source = "../modules/nodegroup"

  cluster_name        = module.eks.cluster_name
  node_group_name     = "${var.name_prefix}-nodegroup"
  node_group_role_arn = data.terraform_remote_state.foundation.outputs.nodegroup_role_arn
  subnet_ids          = data.terraform_remote_state.foundation.outputs.private_subnet_ids
  node_instance_types = var.node_instance_types
  desired_size        = var.node_desired_size
  min_size            = var.node_min_size
  max_size            = var.node_max_size

  depends_on = [
    module.eks
  ]
}
