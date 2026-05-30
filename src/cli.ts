#!/usr/bin/env node

import yargs from 'yargs';
import { run } from './run';

// NOTE (commoncurriculum fork): import the `yargs` main entry (resolves to
// `index.cjs`, real CommonJS) instead of the `yargs/yargs` subpath, and inline
// `hideBin` as `process.argv.slice(2)`. yargs@17 marks the `./yargs` and
// `./helpers` require targets as extensionless / `.js` files inside a
// `"type":"module"` package, which Node >=22's `require(ESM)` loads as ESM and
// then throws `ReferenceError: require is not defined in ES module scope`.
// Going through the `.cjs` main entry avoids both broken subpaths.
const yarg = yargs(process.argv.slice(2))
  .usage('Create .css.d.ts from CSS modules *.css files.\nUsage: $0 [options] <search directory>')
  .example('$0 src/styles', '')
  .example('$0 src -o dist', '')
  .example('$0 -p styles/**/*.css -w', '')
  .detectLocale(false)
  .demand(['_'])
  .options({
    p: {
      desc: 'Glob pattern with css files',
      type: 'string',
      alias: 'pattern',
    },
    o: {
      desc: 'Output directory',
      type: 'string',
      alias: 'outDir',
    },
    l: {
      desc: 'List any files that are different than those that would be generated. If any are different, exit with a status code 1.',
      type: 'boolean',
      alias: 'listDifferent',
    },
    w: {
      desc: "Watch input directory's css files or pattern",
      type: 'boolean',
      alias: 'watch',
    },
    c: {
      desc: "Watch input directory's css files or pattern",
      type: 'boolean',
      alias: 'camelCase',
    },
    e: {
      type: 'boolean',
      desc: 'Use named exports as opposed to default exports to enable tree shaking.',
      alias: 'namedExports',
    },
    a: {
      type: 'boolean',
      desc: 'Use the ".d.css.ts" extension to be compatible with the equivalent TypeScript option',
      alias: 'allowArbitraryExtensions',
    },
    d: {
      type: 'boolean',
      desc: "'Drop the input files extension'",
      alias: 'dropExtension',
    },
    s: {
      type: 'boolean',
      alias: 'silent',
      desc: 'Silent output. Do not show "files written" messages',
    },
  })
  .alias('h', 'help')
  .help('h')
  .version(require('../package.json').version);

main();

async function main(): Promise<void> {
  const argv = await yarg.argv;

  if (argv.h) {
    yarg.showHelp();
    return;
  }

  let searchDir: string;
  if (argv._ && argv._[0]) {
    searchDir = `${argv._[0]}`;
  } else if (argv.p) {
    searchDir = './';
  } else {
    yarg.showHelp();
    return;
  }

  await run(searchDir, {
    pattern: argv.p,
    outDir: argv.o,
    watch: argv.w,
    camelCase: argv.c,
    namedExports: argv.e,
    dropExtension: argv.d,
    allowArbitraryExtensions: argv.a,
    silent: argv.s,
    listDifferent: argv.l,
  });
}
