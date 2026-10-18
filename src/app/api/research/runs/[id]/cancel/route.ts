import { researchRequest } from '@/lib/research/http';
import { cancelResearch } from '@/lib/research/service';
import { uuid } from '@/lib/research/validation';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return researchRequest(request, async (subject) =>
    cancelResearch(uuid((await params).id), subject),
  );
}
