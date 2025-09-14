const {prismaClient, PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

console.log("Prisma Client instaciado!");

module.exports = prisma;