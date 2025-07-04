import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Request, Response } from 'express';

export async function verifySession(req: Request, res: Response) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}
