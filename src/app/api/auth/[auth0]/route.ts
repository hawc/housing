import { logger } from '@/lib/logger';
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  onError(req: Request, error: Error) {
    logger(error, 'Authentication error.');
  },
});
