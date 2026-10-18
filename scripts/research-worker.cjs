require('@next/env').loadEnvConfig(
  process.cwd(),
  process.env.NODE_ENV !== 'production',
);
require('ts-node').register({
  compilerOptions: { module: 'CommonJS', moduleResolution: 'node' },
});
require('../src/lib/research/worker')
  .runWorker(process.argv.includes('--once'))
  .catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
