import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validateBody } from './middleware/validate';
import { CreateSubscriptionDTO, UpdateSubscriptionDTO, subscriptionSchema, subscriptionUpdateSchema } from './types';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// validation schemas are defined in src/types and reused here

app.get('/api/subscriptions', async (_req: Request, res: Response) => {
  try {
    const subs = await prisma.subscription.findMany({ orderBy: { created_at: 'desc' } });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/subscriptions/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/subscriptions', validateBody<CreateSubscriptionDTO>(subscriptionSchema), async (req: Request, res: Response) => {
  try {
    const { name, price, currency, frequency, payment_date } = req.body as CreateSubscriptionDTO;
    const created = await prisma.subscription.create({
      data: { name, price: Number(price), currency, frequency, payment_date },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/subscriptions/:id', validateBody<UpdateSubscriptionDTO>(subscriptionUpdateSchema), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const payload = req.body as UpdateSubscriptionDTO;
    const updated = await prisma.subscription.update({ where: { id }, data: payload });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/subscriptions/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.subscription.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
