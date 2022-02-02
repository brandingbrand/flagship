#!/usr/bin/env ./node_modules/.bin/ts-node

import parseCommit from '@commitlint/parse';
import { Commit } from '@commitlint/types';

import { logger } from '@nrwl/devkit';
import { FsTree } from '@nrwl/tao/src/shared/tree';
import { Workspace, Workspaces } from '@nrwl/tao/src/shared/workspace';

import dedent from 'ts-dedent';
import { prompt } from 'inquirer';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { sep } from 'path';

const commitMessageFile = process.argv[2] as string | undefined;
const whitelistedFiles = [
  'tsconfig.base.json',
  'workspace.json',
  'package.json',
  'package-lock.json',
];

const isWithin = (file: string, path: string) => {
  const fileDirs = file.split(sep);
  return path.split(sep).every((dir, i) => fileDirs[i] === dir);
};

const getWorkspace = (): Workspace => {
  return new Workspaces(process.cwd()).readWorkspaceConfiguration();
};

const getStagedFiles = async () => {
  return new Promise<string[]>((resolve, reject) => {
    exec('git diff --name-only --cached', {}, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout.trim().split('\n'));
    });
  });
};

const getChangedProjects = async (
  workspace: Workspace,
  stagedFiles: string[]
): Promise<string[]> => {
  return Object.entries(workspace.projects)
    .filter(([, { root }]) => root !== '.' && stagedFiles.some((file) => isWithin(file, root)))
    .map(([name]) => name);
};

const verifyBreakingChange = async (commit: Commit) => {
  if (commit.notes.some(({ title }) => title === 'BREAKING CHANGE')) {
    const { confirmed } = await prompt({
      name: 'confirmed',
      message: dedent`Your commit includes a breaking change, it will only be able to be
                      released at the end of Q1 or Q3.

                      Are you sure you want to continue?`,
      type: 'confirm',
    });

    if (!confirmed) {
      process.exit(1);
    }
  }
};

const verifyProjectScope = async (commit: Commit, changedProjects: string[]) => {
  if (
    commit.scope &&
    changedProjects.length > 0 &&
    changedProjects.some((project) => project !== commit.scope)
  ) {
    const changedProjectsString = changedProjects.join(', ');
    const { confirmed } = await prompt({
      name: 'confirmed',
      message: dedent`Your change affects ${changedProjectsString} but your scope is ${commit.scope}.
                      Typically you would want one commit for each project changed.

                      Are you sure you want to continue?`,
      type: 'confirm',
    });

    if (!confirmed) {
      process.exit(1);
    }
  }
};

const rootScopes = ['workspace', 'ci', 'deps', 'repo'];
const verifyWorkspaceScope = async (commit: Commit, changedProjects: string[]) => {
  if (!commit.scope || (!rootScopes.includes(commit.scope) && changedProjects.length === 0)) {
    const { confirmed } = await prompt({
      name: 'confirmed',
      message: dedent`No projects seem to have been affected, but your scope is ${commit.scope}.
                      Typically you would want to use the workspace scope when making changes that
                      do not apply to a specific project.

                      Are you sure you want to continue?`,
      type: 'confirm',
    });

    if (!confirmed) {
      process.exit(1);
    }
  }
};

const verifyClosedProjectReferences = async (workspace: Workspace, stagedFiles: string[]) => {
  const closedSourceProjects = Object.values(workspace.projects).filter(
    ({ root, tags }) => root !== '.' && !tags?.includes('open-source')
  );

  const openFiles = stagedFiles
    .filter((file) => !closedSourceProjects.some(({ root }) => isWithin(file, root)))
    .filter((file) => !whitelistedFiles.includes(file));

  const tree = new FsTree(process.cwd(), false);
  for (const file of openFiles) {
    const contents = tree.read(file)?.toString('utf-8');

    for (const { root } of closedSourceProjects) {
      if (contents?.includes(root)) {
        const { confirmed } = await prompt({
          name: 'confirmed',
          message: dedent`Found reference to closed source project ${root} in ${file}.
                          Typically closed source projects should only be referenced within their
                          own files.

                          Are you sure you want to continue?`,
          type: 'confirm',
        });

        if (!confirmed) {
          process.exit(1);
        }
      }
    }
  }
};

const main = async (commitFile: string | undefined) => {
  if (commitFile === undefined) {
    logger.error('No commit message provided');
    process.exit(1);
  }

  const commitMessage = (await readFile(commitFile)).toString('utf-8');
  const commit = await parseCommit(commitMessage);

  const workspace = getWorkspace();
  const stagedFiles = await getStagedFiles();

  const changedProjects = await getChangedProjects(workspace, stagedFiles);

  if (commit.scope !== 'release') {
    await verifyBreakingChange(commit);
    await verifyProjectScope(commit, changedProjects);
    await verifyWorkspaceScope(commit, changedProjects);
    await verifyClosedProjectReferences(workspace, stagedFiles);
  }
};

void main(commitMessageFile).catch((error: unknown) => {
  logger.error(error);
  process.exit(1);
});
