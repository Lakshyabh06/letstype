output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_ids" {
  value = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.network.private_subnet_ids
}

output "eks_sg_id" {
  value = module.network.eks_sg_id
}

output "rds_sg_id" {
  value = module.network.rds_sg_id
}

output "eks_cluster_role_arn" {
  value = module.iam.eks_cluster_role_arn
}

output "nodegroup_role_name" {
  value = module.iam.nodegroup_role_name
}

output "nodegroup_role_arn" {
  value = module.iam.nodegroup_role_arn
}

output "frontend_ecr_repository_url" {
  value = module.ecr.frontend_repository_url
}

output "backend_ecr_repository_url" {
  value = module.ecr.backend_repository_url
}
