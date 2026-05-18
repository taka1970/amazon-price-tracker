import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// 全商品の履歴を返す
router.get('/history', async (req, res) => {
  const data = await prisma.price.findMany({
    orderBy: { createdAt: 'asc' }
  });

  res.json(data);
});

export default router;
