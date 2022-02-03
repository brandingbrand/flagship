const childProcess = require('child_process');
const { mapValues } = require('lodash');
const { Workspaces } = require('@nrwl/tao/src/shared/workspace');

const tryRequire = (path) => {
  try {
    return require(path);
  } catch {
    return null;
  }
};

const trimString = (string, length) =>
  string.length > length ? `${string.substring(0, length)}...` : string;

const nx = require('../workspace.json');
const workspaces = new Workspaces(process.cwd());
const projects = mapValues(nx.projects, (pathOrProject) =>
  typeof pathOrProject === 'string' ? require(`../${pathOrProject}/project.json`) : pathOrProject
);

const nxCommands = mapValues(projects, (project, name) => {
  const commands = Object.entries(project.targets)
    .map(([target, targetConfig]) => {
      const configurationCommands = Object.keys(targetConfig.configurations ?? {}).map(
        (configuration) => ({
          command: `${name}:${target}:${configuration}`,
          description: '',
        })
      );

      const [nodeModule, executor] = targetConfig.executor.split(':');
      const { schema } = workspaces.readExecutor(nodeModule, executor);

      return [
        { command: `${name}:${target}`, description: schema?.description },
        ...configurationCommands,
      ];
    })
    .flat();

  return {
    ...project,
    commands,
  };
});

const blacklistedCommands = new Set([
  'workspace:android',
  'workspace:ios',
  'workspace:build',
  'workspace:lint',
  'workspace:test',
  'workspace:pr',
]);

const nxScripts = Object.entries(nxCommands)
  .map(([project, { root, commands }], i) => {
    const package = tryRequire(`../${root}/package.json`);
    const commandScripts = commands
      .filter(({ command }) => !blacklistedCommands.has(command))
      .reduce(
        (aggregate, { command, description }) => ({
          ...aggregate,
          [command]: {
            script: `nx run ${command}`,
            description: trimString(description ?? '', 28),
          },
        }),
        {}
      );

    return {
      [project]: {
        script: `nps | grep ${project}:`,
        description: trimString(package?.description ?? '', 28),
      },
      ...commandScripts,
      ['​'.repeat(i + 1)]: ' ',
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
      description: 'Build all docker images',
    },
    'docker:affected': {
      script: 'nx affected --target docker',
      description: 'Build affected docker images',
    },
    'format': {
      script: 'nps | grep format:',
      description: 'List formatting commands',
    },
    'format:check': {
      script: 'nx format:check',
      description: 'Checks file formatting',
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
      description: 'Interactive commit',
    },
    'pr': {
      script: 'nx pr workspace',
      description: 'Interactive pull request',
    },
    ' ': ' ',
    ...nxScripts,
  },
};
