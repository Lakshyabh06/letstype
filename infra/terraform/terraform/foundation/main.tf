module "network" {
  source = "../modules/network"

  name_prefix          = var.name_prefix
  vpc_cidr_block       = var.vpc_cidr_block
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  public_azs           = var.public_azs
  private_azs          = var.private_azs

  cluster_name = "${var.name_prefix}-eks"
}

module "iam" {
  source = "../modules/iam"

  name_prefix = var.name_prefix
}

module "ecr" {
  source = "../modules/ecr"

  name_prefix = var.name_prefix
}
