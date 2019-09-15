import * as fs from 'fs';
import * as path from 'path';

function asyncApiConverter(api: Function) {
  return function promiseApi(...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject): void => {
      api(...args, (err: Error, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };
}

export const stat = asyncApiConverter(fs.stat);
export const readdir = asyncApiConverter(fs.readdir);
export const mkdir = asyncApiConverter(fs.mkdir);
export const readFile = asyncApiConverter(fs.readFile);
export const writeFile = asyncApiConverter(fs.writeFile);

export function isDirectory(filePath: string): boolean {
  return fs.statSync(filePath).isDirectory();
}

export async function mkdirp(destPath: string, ...args: any[]): Promise<void> {
  let argPath = destPath;
  let dirPath = '';
  if (path.isAbsolute(destPath)) {
    const winDiskPart = destPath.match(/^[a-z]:/i);
    if (winDiskPart) {
      dirPath = `${winDiskPart[0]}\\`;
      argPath = argPath.slice(2);
    } else {
      dirPath = '/';
    }
  }

  const pathSegments = argPath.split(path.sep);
  if (!pathSegments[0]) {
    pathSegments.shift();
  }
  if (!pathSegments[pathSegments.length - 1]) {
    pathSegments.pop();
  }

  for (let i = 0; i < pathSegments.length; i++) {
    dirPath = path.join(dirPath, pathSegments[i]);
    if (!fs.existsSync(dirPath)) {
      await mkdir(dirPath, ...args);
    }
  }
}

export async function writeFileP(filePath: string, data: string, ...args: any[]): Promise<void> {
  const fileDir = path.dirname(filePath);
  if (!fs.existsSync(fileDir)) {
    await mkdirp(fileDir);
  }
  await writeFile(filePath, data, ...args);
}
