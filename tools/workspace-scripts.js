const childProcess = require('child_process');
const { mapValues } = require('lodash');

const tryRequire = (path) => {
  try {
    return require(path);
  } catch {
    return null;
  }
};

const nx = require('../workspace.json');
const projects = mapValues(nx.projects, (pathOrProject) =>
  typeof pathOrProject === 'string' ? require(`../${pathOrProject}/project.json`) : pathOrProject
);

const nxCommands = mapValues(projects, (project, name) => {
  const commands = Object.entries(project.targets)
    .map(([target, { configurations }]) => {
      const configurationCommands = Object.keys(configurations ?? {}).map(
        (configuration) => `${name}:${target}:${configuration}`
      );

      return [`${name}:${target}`, ...configurationCommands];
    })
    .flat();

  return {
    ...project,
    commands,
  };
});

const nxScripts = Object.entries(nxCommands)
  .map(([project, { root, commands }]) => {
    const package = tryRequire(`../${root}/package.json`);
    const commandScripts = commands.reduce(
      (aggregate, command) => ({
        ...aggregate,
        [command]: `nx run ${command}`,
      }),
      {}
    );

    return {
      [project]: {
        script: `nps | grep ${project}:`,
        description: package?.description ?? '',
      },
      ...commandScripts,
    };
  })
  .reduce((aggregate, commands) => {
    return { ...aggregate, ...commands };
  });

const rootRevision = childProcess
  .spawnSync('git', ['rev-list', '--max-parents=0', 'HEAD'])
  .stdout.toString('utf-8');

module.exports = {
  scripts: {
    'build:all': {
      script: 'nx run-many --target build --all',
      description: 'Build all projects',
    },
    'build:affected': {
      script: 'nx affected --target build',
      description: 'Build affected projects',
    },
    'test:all': {
      script: 'nx run-many --target test --all',
      description: 'Test all projects',
    },
    'test:affected': {
      script: 'nx affected --target test',
      description: 'Test affected projects',
    },
    'lint:all': {
      script: 'nx run-many --target lint --all',
      description: 'Lint all projects',
    },
    'lint:affected': {
      script: 'nx affected --target lint',
      description: 'Lint affected projects',
    },
    'docker:all': {
      script: 'nx run-many --target docker --all',
      description: 'Build docker images of all projects',
    },
    'docker:affected': {
      script: 'nx affected --target docker',
      description: 'Build docker images of affected projects',
    },
    'format': {
      script: 'nps | grep format:',
      description: 'List formatting commands',
    },
    'format:check': {
      script: 'nx format:check',
      description: 'Checks that changed files are formatted',
    },
    'format:check:all': {
      script: `nx format:check --base ${rootRevision}`,
      description: 'Formats all files',
    },
    'format:write': {
      script: 'nx format:write',
      description: 'Formats changed files',
    },
    'format:write:all': {
      script: `nx format:write --base ${rootRevision}`,
      description: 'Formats all files',
    },
    'commit': {
      script: 'cz',
      description: 'Walks through the process of creating a commit message',
    },
    ...nxScripts,
  },
};
