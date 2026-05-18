import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function savePrice(product, price) {
  return prisma.price.create({
    data: {
      product,
      price,
    },
  });
}
