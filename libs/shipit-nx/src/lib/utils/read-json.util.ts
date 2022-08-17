import { readFile } from 'fs/promises';

export const readJson = async <T>(file: string): Promise<T> => {
  const buffer = await readFile(file);
  const contents = buffer.toString('utf8');
  return JSON.parse(contents) as T;
};
