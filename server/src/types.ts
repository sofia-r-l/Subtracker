import { z } from 'zod';

// reuse same schema definitions used by the server
export const subscriptionSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string(),
  frequency: z.string(),
  payment_date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
});

export const subscriptionUpdateSchema = subscriptionSchema.partial();

export type CreateSubscriptionDTO = z.infer<typeof subscriptionSchema>;
export type UpdateSubscriptionDTO = z.infer<typeof subscriptionUpdateSchema>;

// Helper for Express request typing
import { Request } from 'express';

export type RequestWithBody<T> = Request & { body: T };
