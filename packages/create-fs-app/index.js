#!/usr/bin/env node

const currentNodeMajorVersion = process.versions.node.split('.')[0];

if (currentNodeMajorVersion < 10) {
  console.error('create-fs-app requires Node 10 or higher.\n');
  process.exit(1);
}

require('./dist/index');
