import { basename, dirname, extname, join } from 'path';

export const removeExtension = (path: string) => {
  return join(dirname(path), basename(path, extname(path)));
};
