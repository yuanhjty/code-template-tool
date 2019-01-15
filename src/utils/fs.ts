import * as fs from 'fs';

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
