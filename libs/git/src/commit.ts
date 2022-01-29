import {
  ConventionalChangelogCommit,
  parser,
  toConventionalChangelogFormat,
} from '@conventional-commits/parser';

const REVERT_REGEX = /^Revert "(.*)"$/;

export interface Diff {
  path: string;
  body: string;
}

export type Header = Pick<
  ConventionalChangelogCommit,
  'merge' | 'references' | 'revert' | 'scope' | 'subject' | 'type'
> & { breaking: boolean };

export interface CommitData {
  id: string;
  timestamp: string;
  author: string;
  header: Header;
  description: string;
  diffs: Set<Diff>;
  coAuthorLines: readonly string[];
}

export class Commit implements CommitData {
  public readonly id!: string;
  public readonly timestamp!: string;
  public readonly author!: string;
  public readonly header!: Header;
  public readonly description!: string;
  public readonly diffs = new Set<Diff>();
  public readonly coAuthorLines: readonly string[] = [];

  public get subject(): string {
    const breaking = this.header.breaking ? '!' : '';
    const scope = this.header.scope === null ? '' : `(${this.header.scope})`;
    return `${this.header.type}${scope}${breaking}: ${this.header.subject}`;
  }

  public get commitMessage(): string {
    return `${this.subject}\n\n${this.description}`;
  }

  private clone(updateProps: Partial<CommitData>): Commit {
    const prototype = Object.getPrototypeOf(this) as Function;

    return Object.assign(Object.create(prototype), this, updateProps) as Commit;
  }

  public isValid(): boolean {
    return this.diffs.size > 0;
  }

  public withID(id: string): Commit {
    return this.clone({ id });
  }

  public withTimestamp(timestamp: string): Commit {
    return this.clone({ timestamp });
  }

  public withAuthor(author: string): Commit {
    return this.clone({ author });
  }

  public withCoAuthorLines(coAuthorLines: readonly string[]): Commit {
    return this.clone({ coAuthorLines });
  }

  public withHeader(subject: string): Commit {
    const isRevertCommit = REVERT_REGEX.test(subject);
    const correctedSubject = isRevertCommit ? subject.replace(REVERT_REGEX, '$1') : subject;

    const parsed = toConventionalChangelogFormat(parser(correctedSubject));
    return this.clone({
      header: {
        merge: parsed.merge,
        revert: isRevertCommit || parsed.revert,
        subject: parsed.subject,
        references: parsed.references,
        scope: parsed.scope,
        type: parsed.type,
        breaking: parsed.notes.some(({ title }) => title === 'BREAKING CHANGE'),
      },
    });
  }

  public withSubject(subject: string): Commit {
    return this.clone({
      header: {
        ...this.header,
        subject,
      },
    });
  }

  public withScope(scope: string): Commit {
    return this.clone({
      header: {
        ...this.header,
        scope,
      },
    });
  }

  public withType(type: string): Commit {
    return this.clone({
      header: {
        ...this.header,
        type,
      },
    });
  }

  public withDescription(description: string): Commit {
    return this.clone({ description });
  }

  public withDiffs(diffs: Set<Diff>): Commit {
    return this.clone({ diffs });
  }
}
