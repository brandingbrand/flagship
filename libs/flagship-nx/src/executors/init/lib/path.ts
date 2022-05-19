import { basename, dirname, extname, join, sep } from 'path';

export const removeExtension = (path: string) =>
  join(dirname(path), basename(path, extname(path)))
    .split(sep)
    .join('/');
