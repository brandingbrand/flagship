import { invariant } from './invariant.util';

export type Yield = string;

/**
 * See: https://github.com/facebook/fbshipit/blob/640eb8640bdf6e024a3a6eff7703f188d8a0d66a/src/shipit/ShipItUtil.php
 *
 * @param patch the patch to parse
 * @yields the parsed patch
 */
// eslint-disable-next-line complexity
export function* parsePatch(patch: string): Generator<Yield, void, void> {
  let contents = '';
  let lineNumber = 0;

  let minusLines = 0;
  let plusLines = 0;
  let hasSeenRangeHeader = false;

  for (const line of patch.split('\n')) {
    lineNumber += 1;

    if (/^diff --git [ab]\/.*? [ab]\/.*?$/.test(line.trimEnd())) {
      if (contents !== '') {
        yield contents;
      }
      hasSeenRangeHeader = false;
      contents = `${line}\n`;
      continue;
    }

    const matches = /^@@ -\d+(?:,(?<minus_lines>\d+))? \+\d+(?:,(?<plus_lines>\d+))? @@/.exec(line);
    if (matches) {
      const rawMinusLines = matches.groups?.minus_lines;
      const rawPlusLines = matches.groups?.plus_lines;
      minusLines = rawMinusLines === undefined ? 1 : Number.parseInt(rawMinusLines, 10);
      plusLines = rawPlusLines === undefined ? 1 : Number.parseInt(rawPlusLines, 10);

      contents += `${line}\n`;
      hasSeenRangeHeader = true;
      continue;
    }

    if (!hasSeenRangeHeader) {
      contents += `${line}\n`;
      continue;
    }

    const leftmost = line.charAt(0);
    if (leftmost === '\\') {
      contents += `${line}\n`;
      // doesn't count as a + or - line whatever happens; if NL at EOF
      // changes, there is a + and - for the last line of content
      continue;
    }

    if (minusLines <= 0 && plusLines <= 0) {
      continue;
    }

    switch (leftmost) {
      case '+': {
        plusLines -= 1;
        break;
      }
      case '-': {
        minusLines -= 1;
        break;
      }
      case ' ':
      case '': {
        // context goes from both
        plusLines -= 1;
        minusLines -= 1;

        break;
      }
      default: {
        invariant(false, `Can't parse hunk line ${lineNumber}: ${line}`);
      }
    }
    contents += `${line}\n`;
  }

  if (contents !== '') {
    yield contents;
  }
}
