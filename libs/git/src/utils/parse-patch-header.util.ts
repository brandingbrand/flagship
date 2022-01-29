import { Commit } from '../commit';

import { splitHead } from './split-head.util';

export const parsePatchHeader = (header: string): Commit => {
  const [rawEnvelope, rawBody] = splitHead(header, '\n\n');

  const description = [];
  const coAuthorLines = [];

  // Co-authored-by must be the absolute last thing in the message so we separate it here from the
  // description and compose it later correctly (to add the `brandingbrand-source-id` label correctly).
  for (const line of rawBody.trim().split('\n')) {
    if (line.startsWith('Co-authored-by:')) {
      coAuthorLines.push(line);
    } else {
      description.push(line);
    }
  }

  let commit = new Commit()
    .withDescription(description.join('\n'))
    .withCoAuthorLines(coAuthorLines);

  const envelope = rawEnvelope.replace(/\n\t|\n /, ' ');
  for (const line of envelope.split('\n')) {
    if (!line.includes(':')) {
      continue;
    }
    const [key, rawValue] = splitHead(line, ':');
    const value = rawValue.trim();
    switch (key.trim().toLowerCase()) {
      case 'from':
        commit = commit.withAuthor(value);
        break;

      case 'subject':
        commit = commit.withHeader(value.replace(/^\[PATCH] /, ''));
        break;

      case 'date':
        commit = commit.withTimestamp(value);
        break;

      default:
        break;
    }
  }
  return commit;
};
