#!/usr/bin/env node

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .commandDir('dist/commands')
  .help()
  .argv;
