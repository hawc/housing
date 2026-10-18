// Uses a disposable local CockroachDB database; never reads the project's DATABASE_URL.
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const testUrl = process.env.RESEARCH_TEST_DATABASE_URL;
if (!testUrl)
  throw new Error(
    'Set RESEARCH_TEST_DATABASE_URL to a local database ending in _test.',
  );
const url = new URL(testUrl);
if (
  !['127.0.0.1', 'localhost'].includes(url.hostname) ||
  !url.pathname.endsWith('_test')
) {
  throw new Error(
    'Integration tests only allow a local database ending in _test.',
  );
}
process.env.DATABASE_URL = testUrl;
process.env.OPENAI_API_KEY = 'integration-test-key-no-network';
global.fetch = () => {
  throw new Error('No network access allowed in integration tests.');
};
require('ts-node').register({
  compilerOptions: { module: 'CommonJS', moduleResolution: 'node' },
});
const prisma = require('../src/lib/prisma').default;
const service = require('../src/lib/research/service');
const provider = require('../src/lib/research/provider');
const { workOnce } = require('../src/lib/research/worker');

async function main() {
  const prefix = `research-test-${randomUUID()}`;
  const detailType = await prisma.detailTypes.create({
    data: { name: 'Wohneinheiten' },
  });
  const resourceType = await prisma.resourceTypes.create({
    data: { name: prefix },
  });
  // Resource type must be a recognized source type.
  await prisma.resourceTypes.update({
    where: { id: resourceType.id },
    data: { name: `Website ${prefix}` },
  });
  const settlements = await Promise.all(
    Array.from({ length: 5 }, (_, index) =>
      prisma.settlements.create({
        data: { name: `${prefix}-${index}`, slug: `${prefix}-${index}` },
      }),
    ),
  );
  const ids = settlements.map((item) => item.id);
  let checks = 0;
  const check = (condition, message) => {
    assert.ok(condition, message);
    checks++;
  };
  const rejects = async (callback, pattern) => {
    await assert.rejects(callback, pattern);
    checks++;
  };
  const source = {
    url: `https://example.org/${prefix}`,
    title: 'Kommunale Bestandsaufnahme',
    text: 'In dieser Siedlung wurden im Jahr 2020 genau 1234 Wohnungen gezählt.',
    retrievedAt: new Date(),
  };
  provider.researchSettlement = async () => ({
    candidates: [
      {
        kind: 'DETAIL',
        draft: {
          name: 'Wohneinheiten',
          value: '1234',
          typeId: detailType.id,
          annotation: 'Bezugsgebiet: Gesamte Siedlung',
          referenceYear: 2020,
        },
        source,
        evidence: source.text,
        locator: 'Abschnitt Bestand',
        warnings: '',
      },
      {
        kind: 'RESOURCE',
        draft: {
          name: 'Bestandsaufnahme',
          value: 'Kommunale Angaben zur Siedlung',
          typeId: resourceType.id,
          annotation: '',
          referenceYear: null,
        },
        source,
        evidence: source.text,
        locator: 'Abschnitt Bestand',
        warnings: '',
      },
    ],
    notes: 'Deterministische Testrecherche.',
    responseIds: ['test-discovery', 'test-extraction'],
  });
  try {
    await rejects(
      () => service.startResearch([], 'test-admin'),
      /eine bis fünf/,
    );
    delete process.env.OPENAI_API_KEY;
    await rejects(
      () => service.startResearch(ids, 'test-admin'),
      /OPENAI_API_KEY/,
    );
    process.env.OPENAI_API_KEY = 'integration-test-key-no-network';
    const starts = await Promise.allSettled([
      service.startResearch(ids, 'test-admin'),
      service.startResearch(ids, 'test-admin'),
    ]);
    check(
      starts.filter((item) => item.status === 'fulfilled').length === 1,
      'Concurrent batch starts create only one active run',
    );
    const run = starts.find((item) => item.status === 'fulfilled').value;
    await rejects(
      () => service.startResearch(ids, 'test-admin'),
      /bereits eine Recherche/,
    );
    check(
      (await prisma.details.count({ where: { settlementId: { in: ids } } })) ===
        0,
      'Starting research must not publish content',
    );
    for (let index = 0; index < 5; index++)
      check(await workOnce(), 'Each queued job is processed');
    check(!(await workOnce()), 'Queue drains');
    const proposals = await prisma.changeProposal.findMany({
      where: { job: { runId: run.id } },
    });
    check(
      proposals.length === 10,
      'Five settlements yield ten staged proposals',
    );
    check(
      (await prisma.details.count({ where: { settlementId: { in: ids } } })) ===
        0,
      'Research must not publish details',
    );
    check(
      (await prisma.resources.count({
        where: { settlementId: { in: ids } },
      })) === 0,
      'Research must not publish resources',
    );

    const detail = (index) =>
      proposals.find(
        (item) => item.kind === 'DETAIL' && item.settlementId === ids[index],
      );
    const resource = (index) =>
      proposals.find(
        (item) => item.kind === 'RESOURCE' && item.settlementId === ids[index],
      );
    const first = detail(0);
    // Simulate an already queued proposal from before the form expansion.
    for (const key of ['detailDate', 'source', 'url', 'license', 'copyright'])
      delete first.payload[key];
    await prisma.changeProposal.update({
      where: { id: first.id },
      data: { payload: first.payload },
    });
    await rejects(
      () =>
        service.reviewProposal(
          first.id,
          1,
          'approve',
          'test-admin',
          { ...first.payload, referenceYear: null, detailDate: null },
          '',
        ),
      /Bezugsdatum/,
    );
    check(
      (await prisma.changeProposal.findUnique({ where: { id: first.id } }))
        .status === 'PENDING',
      'An undated statistic cannot consume the approval',
    );
    check(
      (await prisma.details.count({
        where: { settlementId: first.settlementId },
      })) === 0,
      'Rejected undated statistics create no public records',
    );
    await rejects(
      () =>
        service.reviewProposal(
          first.id,
          99,
          'approve',
          'test-admin',
          first.payload,
          '',
        ),
      /Vorschlagsversion|bereits verändert/,
    );
    const edited = {
      ...first.payload,
      value: '1235',
      annotation:
        'Bezugsgebiet: Gesamte Siedlung\nNach Quellenprüfung korrigiert',
    };
    const approvals = await Promise.all([
      service.reviewProposal(
        first.id,
        1,
        'approve',
        'test-admin',
        edited,
        'Geprüft',
      ),
      service.reviewProposal(
        first.id,
        1,
        'approve',
        'test-admin',
        edited,
        'Geprüft',
      ),
    ]);
    check(
      approvals.every((item) => item.status === 'APPLIED'),
      'Concurrent approvals are idempotent',
    );
    const saved = await prisma.details.findMany({
      where: { settlementId: ids[0] },
    });
    check(
      saved.length === 1 && saved[0].description === '1235',
      'Only the reviewed edit is published once',
    );
    check(
      saved[0].source === source.url &&
        saved[0].annotation.includes('2020') &&
        saved[0].detailDate.toISOString() === '2020-12-31T00:00:00.000Z',
      'Year-only evidence uses December 31 while preserving source precision',
    );
    check(
      (await prisma.changeLog.count({ where: { proposalId: first.id } })) === 1,
      'Exactly one audit record',
    );
    await rejects(
      () =>
        service.reviewProposal(
          first.id,
          1,
          'approve',
          'other-admin',
          { ...edited, value: '9999' },
          'Concurrent edit',
        ),
      /anderen Werten/,
    );
    const res = resource(0);
    const reviewedResource = {
      ...res.payload,
      source: 'Statistikamt',
      license: 'CC BY 4.0',
      copyright: 'Stadtarchiv',
      value: '',
    };
    check(
      (
        await service.reviewProposal(
          res.id,
          1,
          'approve',
          'test-admin',
          reviewedResource,
          '',
        )
      ).status === 'APPLIED',
      'A source link can be approved independently',
    );
    await service.reviewProposal(
      res.id,
      1,
      'approve',
      'test-admin',
      reviewedResource,
      '',
    );
    check(
      (await prisma.resources.count({ where: { settlementId: ids[0] } })) === 1,
      'Source approval is idempotent',
    );
    const savedResource = await prisma.resources.findFirst({
      where: { settlementId: ids[0] },
    });
    check(
      savedResource.source === 'Statistikamt' &&
        savedResource.license === 'CC BY 4.0' &&
        savedResource.copyright === 'Stadtarchiv' &&
        savedResource.description === '' &&
        savedResource.url === source.url,
      'All reviewed resource fields are saved exactly',
    );
    const resourceProof = await prisma.changeProposal.findUnique({
      where: { id: res.id },
      include: { source: true },
    });
    check(
      resourceProof.source.title === source.title,
      'Editing a stored source field does not change the research evidence',
    );

    const rejected = detail(1);
    await service.reviewProposal(
      rejected.id,
      1,
      'reject',
      'test-admin',
      null,
      'Bezieht sich auf den Stadtteil.',
    );
    check(
      (await prisma.details.count({ where: { settlementId: ids[1] } })) === 0,
      'Rejection does not publish',
    );
    await rejects(
      () =>
        service.reviewProposal(
          rejected.id,
          1,
          'approve',
          'test-admin',
          rejected.payload,
          '',
        ),
      /bereits verändert/,
    );

    const stale = detail(2);
    await prisma.details.create({
      data: {
        name: 'Manueller Eintrag',
        description: '2000',
        settlementId: ids[2],
        detailTypeId: detailType.id,
      },
    });
    check(
      (
        await service.reviewProposal(
          stale.id,
          1,
          'approve',
          'test-admin',
          stale.payload,
          '',
        )
      ).status === 'STALE',
      'Intervening manual changes invalidate approval',
    );
    check(
      (await prisma.details.count({ where: { settlementId: ids[2] } })) === 1,
      'A stale proposal does not publish',
    );

    const rollback = detail(3);
    await prisma.detailTypes.update({
      where: { id: detailType.id },
      data: { published: false },
    });
    await rejects(
      () =>
        service.reviewProposal(
          rollback.id,
          1,
          'approve',
          'test-admin',
          rollback.payload,
          '',
        ),
      /Detailtyp/,
    );
    check(
      (await prisma.changeProposal.findUnique({ where: { id: rollback.id } }))
        .status === 'PENDING',
      'Failed transaction rolls back the approval claim',
    );
    check(
      (await prisma.changeLog.count({ where: { proposalId: rollback.id } })) ===
        0,
      'Failed transaction leaves no audit or content',
    );
    await prisma.detailTypes.update({
      where: { id: detailType.id },
      data: { published: true },
    });
    const exactPayload = {
      ...rollback.payload,
      referenceYear: null,
      detailDate: '2021-03-17',
      source: 'Bibliografische Quellenangabe',
    };
    const exact = await prisma.changeProposal.create({
      data: {
        jobId: rollback.jobId,
        settlementId: rollback.settlementId,
        sourceId: rollback.sourceId,
        kind: 'DETAIL',
        fingerprint: randomUUID(),
        payload: exactPayload,
        baseline: rollback.baseline,
        evidence: rollback.evidence,
        locator: rollback.locator,
        warnings: '',
      },
    });
    await service.reviewProposal(
      exact.id,
      1,
      'approve',
      'test-admin',
      exactPayload,
      'Genaues Datum geprüft',
    );
    const exactLog = await prisma.changeLog.findUnique({
      where: { proposalId: exact.id },
    });
    const savedExact = await prisma.details.findUnique({
      where: { id: exactLog.resultId },
    });
    check(
      savedExact.detailDate.toISOString() === '2021-03-17T00:00:00.000Z' &&
        savedExact.source === 'Bibliografische Quellenangabe' &&
        !savedExact.annotation.includes('Jahresangabe'),
      'Exact dates and edited sources persist without a fabricated year annotation',
    );
    await rejects(
      () =>
        service.reviewProposal(
          exact.id,
          1,
          'approve',
          'test-admin',
          { ...exactPayload, source: 'Andere Quelle' },
          '',
        ),
      /anderen Werten/,
    );

    await prisma.settlements.update({
      where: { id: ids[4] },
      data: { published: false },
    });
    check(
      (
        await service.reviewProposal(
          detail(4).id,
          1,
          'approve',
          'test-admin',
          detail(4).payload,
          '',
        )
      ).status === 'STALE',
      'Unpublished settlements reject pending proposals',
    );
    await prisma.settlements.update({
      where: { id: ids[4] },
      data: { published: true },
    });

    // A second identical research run must not resurface rejected or already staged facts.
    const again = await service.startResearch(ids, 'test-admin');
    for (let index = 0; index < 5; index++) await workOnce();
    check(
      (await prisma.changeProposal.count({
        where: {
          job: { runId: again.id },
          settlementId: ids[1],
          kind: 'DETAIL',
        },
      })) === 0,
      'Unchanged rejected facts are not proposed again',
    );
    check(
      (await prisma.changeProposal.count({
        where: {
          job: { runId: again.id },
          settlementId: ids[3],
          kind: 'DETAIL',
        },
      })) === 0,
      'Unchanged pending facts are not duplicated',
    );
    check(
      (await prisma.changeProposal.count({
        where: {
          job: { runId: again.id },
          settlementId: ids[2],
          kind: 'DETAIL',
        },
      })) === 1,
      'Stale proposals may be researched again against the new baseline',
    );
    const dashboard = await service.getResearchDashboard();
    check(
      dashboard.settlements.some((item) => item.id === ids[0]),
      'Dashboard returns settlement selection',
    );
    check(
      dashboard.proposals.some((item) => item.id === rollback.id),
      'Dashboard exposes pending review and evidence',
    );

    // A crashed worker's old lease cannot commit research results.
    const job = await prisma.researchJob.findFirst({
      where: { runId: again.id },
    });
    await prisma.researchJob.update({
      where: { id: job.id },
      data: {
        status: 'RUNNING',
        leaseToken: 'new-owner',
        leaseUntil: new Date(Date.now() + 60000),
      },
    });
    const settlement = await prisma.settlements.findUnique({
      where: { id: job.settlementId },
      include: service.settlementResearchInclude,
    });
    await rejects(
      () =>
        service.persistResearch(job.id, 'expired-owner', settlement, {
          candidates: [],
          notes: '',
          responseIds: [],
        }),
      /anderweitig übernommen/,
    );
    check(
      (await service.cancelResearch(again.id, 'test-admin')).cancelled === 1,
      'A pending or running lease can be cancelled',
    );
    process.stdout.write(
      `${checks} integration checks passed (real CockroachDB, fixture research only).\n`,
    );
  } finally {
    const where = { settlementId: { in: ids } };
    const jobs = await prisma.researchJob.findMany({
      where,
      select: { id: true, runId: true },
    });
    await prisma.changeLog.deleteMany({ where: { proposal: where } });
    await prisma.changeProposal.deleteMany({ where });
    await prisma.researchSource.deleteMany({
      where: { jobId: { in: jobs.map((job) => job.id) } },
    });
    await prisma.researchJob.deleteMany({ where });
    await prisma.researchRun.deleteMany({
      where: { id: { in: jobs.map((job) => job.runId) } },
    });
    await prisma.details.deleteMany({ where });
    await prisma.resources.deleteMany({ where });
    await prisma.settlements.deleteMany({ where: { id: { in: ids } } });
    await prisma.detailTypes.delete({ where: { id: detailType.id } });
    await prisma.resourceTypes.delete({ where: { id: resourceType.id } });
  }
}
main()
  .catch((error) => {
    process.stderr.write(`${error.stack}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
