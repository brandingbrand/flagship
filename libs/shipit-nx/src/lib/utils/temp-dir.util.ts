import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const tmpDir = (prefix: string): string => fs.mkdtempSync(path.join(os.tmpdir(), prefix));
