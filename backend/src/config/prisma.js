const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;

const prisma = globalForPrisma.letstypePrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.letstypePrisma = prisma;
}

module.exports = {
  prisma
};
