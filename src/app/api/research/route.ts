import { researchRequest, requestBody } from '@/lib/research/http';
import { getResearchDashboard, startResearch } from '@/lib/research/service';
import { ResearchError } from '@/lib/research/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return researchRequest(request, async () => {
    const status = new URL(request.url).searchParams.get('status') ?? 'PENDING';
    if (
      status !== 'PENDING' &&
      status !== 'APPLIED' &&
      status !== 'REJECTED' &&
      status !== 'STALE'
    )
      throw new ResearchError('Unbekannter Reviewstatus.');
    return getResearchDashboard(status);
  });
}

export async function POST(request: Request) {
  return researchRequest(request, async (subject) => {
    const body = await requestBody(request);
    return startResearch(body.settlementIds, subject);
  });
}
