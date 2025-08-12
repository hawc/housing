import { showLogger } from '@/constant/env';

export default function logger(error: unknown, message?: string): void {
  if (!showLogger) return;

  // eslint-disable-next-line no-console
  console.log(message, error);
}
