/** @jest-environment node */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('public repository environment protection', () => {
  it('ignores environment variants and backups while retaining the example', () => {
    const paths = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.test',
      '.env.backup',
      '.env.example',
    ];
    const ignored = execFileSync(
      'git',
      ['check-ignore', '--no-index', '--stdin'],
      {
        cwd: resolve(__dirname, '../../..'),
        input: paths.join('\n') + '\n',
        encoding: 'utf8',
      },
    )
      .trim()
      .split('\n');
    expect(ignored).toEqual(paths.slice(0, -1));
  });

  it('keeps credential placeholders server-only and empty in the template', () => {
    const template = readFileSync(
      resolve(__dirname, '../../../.env.example'),
      'utf8',
    );
    for (const secret of [
      'AUTH0_SECRET',
      'AUTH0_CLIENT_SECRET',
      'OPENAI_API_KEY',
      'CLOUDINARY_API_SECRET',
    ]) {
      expect(template).toMatch(new RegExp(`^${secret}=$`, 'm'));
      expect(template).not.toContain(`NEXT_PUBLIC_${secret}=`);
    }
  });
});
