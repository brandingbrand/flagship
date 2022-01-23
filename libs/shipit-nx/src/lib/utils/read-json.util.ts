import { readFile } from 'fs/promises';

export const readJson = async <T>(file: string) => {
  const buffer = await readFile(file);
  const contents = buffer.toString('utf-8');
  return JSON.parse(contents) as T;
};
