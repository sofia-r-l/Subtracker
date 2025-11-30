import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * Create an express middleware that validates req.body against the provided zod schema.
 * On success the parsed data will replace req.body (so later handlers see the typed payload).
 */
export const validateBody = <T>(schema: ZodTypeAny): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.format() });
    }
    // Replace body with the parsed (typed) value
    req.body = result.data as any;
    return next();
  };
};
