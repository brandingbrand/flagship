# shipit-nx

> Copy commits to external repos

## Prior Work

Shipit was originally a tool developed by Facebook. It was written in PHP and
can be found here under the MIT license. <https://github.com/facebook/fbshipit>

Shipit was later ported to Flow by Adeira in their Universe monorepo which can
be found here under the MIT license. <https://github.com/adeira/universe/tree/master/src/monorepo-shipit>

This codebase started as a TypeScript rewrite of Adeira's work, but has since
been adapted to build around the opinionated structure Nx provides to bring
more features to the tool.

### Getting Started

`shipit-nx` provides an Nx Executor that can be configured either as a target
for a specific project or as a target for the whole workspace.

### Project configuration

When using `shipit-nx` to ship a specific project all that needs to be
configured is the `project.json` of the project to be shipped.

Simply add the following target

```json
    "ship": {
      "executor": "@brandingbrand/shipit-nx:ship",
      "options": {
        "repo": "git@github.com:some-organization/some-repo.git"
      }
    }
```

#### How shipping projects work

`shipit-nx` will clone the destination repo, then start copying commits from
the current repo to that repo. It will run each commit through a series of
filters that will remove references of projects that are not the current
project nor dependant on the current project. For example if you add this to an
`app` then the `app-e2e` will also be shipped as it depends on the `app`.

Any commits that affect files outside of the root of removed projects, like
modifying something in `.vscode` will be kept, however if the scope of the
commit was that of a removed project then the commit message will be rewritten
to `chore(workspace): project configuration`

The `nx.json`, `package.json`, `package-lock.json` and `workspace.json` are
exceptions and commits to these files will not be shipped, but a new commit
will be added to the destination repo generating the latest versions of these
files for that repo.

The `README.md` for the target project will be moved to the root of the
destination repo.

### Workspace configuration

When using `shipit-nx` to ship open source projects across the entire workspace
the target needs to be added to a special project titled `workspace` with a
root of `.` configured under `projects` in `workspace.json`

```json
    "workspace": {
      "root": ".",
      "targets": {
        "ship": {
          "executor": "@brandingbrand/shipit-nx:ship",
          "options": {
            "repo": "git@github.com:some-organization/some-repo.git"
          }
        }
      }
    }
```

#### How shipping open source works

When configured this way `shipit-nx` will filter out all projects that do not
have the tag of `open-source`. Outside of that the process is much the same as
shipping a specific project.

First it clones the destination repo, then it will start copying commits over
using the filter based on the `open-source` tag.

Any commits that affect files outside of the root of removed projects, like
modifying something in `.vscode` will be kept, however if the scope of the
commit was that of a removed project then the commit message will be rewritten
to `chore(workspace): project configuration`

The `nx.json`, `package.json`, `package-lock.json` and `workspace.json` are
exceptions and commits to these files will not be shipped, but a new commit
will be added to the destination repo generating the latest versions of these
files for that repo.

The `README.md` at the root of the project will stay where it as in the open
source repo so be sure not to expose any secrets there.

### Gotchas

Because of how the filtering works special consideration needs to be taken when
adding, removing, renaming or changing the `open-source` tag on projects.

If adding a new project, make sure that the `open-source` tag is preset when
the project is created if you want that project to be open source. Make sure
that the first commit with the project only contains the files in that project
as well as the `workspace.json`, and `tsconfig.base.json` changes.

If removing a project, make sure that all references to the project have been
removed in all other projects first and that those changes are committed with
proper scopes for each project they affect. Then remove the project and the
references in `workspace.json` and `tsconfig.base.json` in the same commit. You
can use the `@nrwl/workspace:remove` generator for this.

If renaming a project, treat it as if you were adding a new project, changing
references in other projects then removing the old project. A renaming should
never be done in the same commit.

If changing the `open-source` tag treat it as if you are removing the project,
then creating a new project.

#### Why?

Commit filtering looks at the commits themselves so simply changing a tag won't
cause the files affected by that change to produce a diff, it would merely
update the filter and then when the next change occurs a merge conflict would
happen because a file that did not exist (as far as the filtered repo was
concerned) was modified.

#### Linear Commit History

Similar to the reasoning above, commit history must be linear. Merge commits
have an ambiguous order by their very nature. So when attempting to replay
commit history to copy the commits over the order must be such that a merge
conflict never occurs. But with merge commits that cannot be guaranteed and as
such they are likely produce errors when trying to run shipit over them much in
the same way you would get merge conflicts if you attempted to `git rebase`
over a merge conflict.
