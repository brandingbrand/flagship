#!/usr/bin/env node
const yargs = require('yargs');

/**
 * Clones and configures boilerplate apps from FLAGSHIP into the host project.
 */
void yargs.usage('Usage: $0 <command> [options]').commandDir('commands').help().argv;

export {};
