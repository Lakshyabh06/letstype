data "terraform_remote_state" "foundation" {
  backend = "s3"

  config = {
    bucket = "letstype-terraform-state"
    key    = "terraform/foundation.tfstate"
    region = "us-east-1"
  }
}

module "rds" {
  source = "../modules/rds"

  name_prefix       = var.name_prefix
  subnet_ids        = data.terraform_remote_state.foundation.outputs.private_subnet_ids
  security_group_id = data.terraform_remote_state.foundation.outputs.rds_sg_id
  db_password       = var.db_password
}
