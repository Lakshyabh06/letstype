output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  value = [for subnet in aws_subnet.private : subnet.id]
}

output "alb_sg_id" {
  value = aws_security_group.alb_sg.id
}

output "eks_sg_id" {
  value = aws_security_group.eks_sg.id
}

output "rds_sg_id" {
  value = aws_security_group.rds_sg.id
}
