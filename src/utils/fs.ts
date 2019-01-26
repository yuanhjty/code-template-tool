import * as fs from 'fs';
import * as path from 'path';

function asyncApiConverter(api: Function) {
    return function(...args: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
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

export function isDirectory(path: string): boolean {
    return fs.statSync(path).isDirectory();
}

export function mkdirSyncP(destPath: string, mode?: string): void {
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

    pathSegments.forEach((segment: string) => {
        dirPath = path.join(dirPath, segment);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, mode);
        }
    });
}
