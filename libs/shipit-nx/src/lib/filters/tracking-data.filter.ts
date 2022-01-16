import { Commit } from '../git/commit';

export const addTrackingData = (commit: Commit): Commit => {
  const revision = commit.id;
  const tracking = `brandingbrand-source-id: ${revision}`;

  let updateDescription = `${commit.description}\n\n${tracking}`;

  // Co-authored-by must be the absolute last thing in the message
  const { coAuthorLines } = commit;
  if (coAuthorLines.length > 0) {
    updateDescription += `\n\n${coAuthorLines.join('\n')}`;
  }

  return commit.withDescription(updateDescription.trim());
};
