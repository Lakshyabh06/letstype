output "eks_cluster_role_arn" {
  value = aws_iam_role.eks_cluster_role.arn
}

output "nodegroup_role_arn" {
  value = aws_iam_role.nodegroup_role.arn
}

output "nodegroup_role_name" {
  value = aws_iam_role.nodegroup_role.name
}
