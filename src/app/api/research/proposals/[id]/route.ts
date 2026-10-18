import { revalidatePath } from 'next/cache';
import { researchRequest, requestBody } from '@/lib/research/http';
import { reviewProposal } from '@/lib/research/service';
import { ResearchError, string, uuid } from '@/lib/research/validation';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return researchRequest(request, async (subject) => {
    const id = uuid((await params).id);
    const body = await requestBody(request);
    if (body.action !== 'approve' && body.action !== 'reject')
      throw new ResearchError('Ungültige Reviewentscheidung.');
    if (!Number.isInteger(body.revision) || Number(body.revision) < 1)
      throw new ResearchError('Ungültige Vorschlagsversion.');
    const note = string(body.note ?? '', 'Reviewnotiz', 1000, false);
    if (body.action === 'reject' && !note)
      throw new ResearchError('Bitte einen Ablehnungsgrund eintragen.');
    const result = await reviewProposal(
      id,
      Number(body.revision),
      body.action,
      subject,
      body.draft,
      note,
    );
    if (result.status === 'APPLIED') {
      revalidatePath('/siedlungen', 'layout');
      revalidatePath('/updates');
    }
    return result;
  });
}
