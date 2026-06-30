module "network" {
  source = "./modules/network"

  name_prefix          = var.name_prefix
  vpc_cidr_block       = var.vpc_cidr_block
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  public_azs           = var.public_azs
  private_azs          = var.private_azs

  cluster_name = "${var.name_prefix}-eks"
}

module "iam" {
  source = "./modules/iam"

  name_prefix = var.name_prefix
}

module "ecr" {
  source = "./modules/ecr"

  name_prefix = var.name_prefix
}

module "rds" {
  source = "./modules/rds"

  name_prefix       = var.name_prefix
  subnet_ids        = module.network.private_subnet_ids
  security_group_id = module.network.rds_sg_id
  db_password       = var.db_password
}

module "eks" {

  source = "./modules/eks"

  cluster_name = "${var.name_prefix}-eks"

  kubernetes_version = var.eks_version

  subnet_ids = concat(
    module.network.private_subnet_ids
  )

  security_group_ids = [
    module.network.eks_sg_id
  ]

  cluster_role_arn = module.iam.eks_cluster_role_arn
}

module "nodegroup" {

  source = "./modules/nodegroup"

  cluster_name = module.eks.cluster_name

  node_group_name = "${var.name_prefix}-nodegroup"

  node_group_role_arn = module.iam.nodegroup_role_arn

  subnet_ids = module.network.private_subnet_ids

  node_instance_types = var.node_instance_types

  desired_size = var.node_desired_size

  min_size = var.node_min_size

  max_size = var.node_max_size

  depends_on = [
    module.eks
  ]
}

resource "aws_iam_role_policy_attachment" "ssm" {

  role = module.iam.nodegroup_role_name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}