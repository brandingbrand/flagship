export const splitHead = (subject: string, separator: string): [string, string] => {
  const pos = subject.indexOf(separator);
  const head = subject.slice(0, Math.max(0, pos));
  const tail = subject.slice(pos + 1);
  return [head, tail];
};
