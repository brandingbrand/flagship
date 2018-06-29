#!/usr/bin/env node
const yargs = require('yargs');

/**
 * Clones and configures boilerplate apps from FLAGSHIP into the host project.
 */
// tslint:disable-next-line:no-unused-expression
yargs
  .usage('Usage: $0 <command> [options]')
  .commandDir('commands')
  .help()
  .argv;

export {};
