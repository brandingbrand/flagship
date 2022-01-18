import { basename, dirname, extname, join, sep } from 'path';

export const removeExtension = (path: string) => {
  return join(dirname(path), basename(path, extname(path)))
    .split(sep)
    .join('/');
};
