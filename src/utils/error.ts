import { resolve } from 'path';

export class FileAlreadyExistsError extends Error {
  constructor(filePath: string) {
    super(`InvalidPathError: EEXIST: ${resolve(filePath)}`);
  }
}

export class NotDirError extends Error {
  constructor(desc?: string) {
    super(`InvalidPathError: ENOTDIR: Not a directory${desc ? '' : `, ${desc}`}`);
  }
}
