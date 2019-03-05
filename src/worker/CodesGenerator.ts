import * as glob from 'glob';
import { statSync, existsSync } from 'fs';
import { resolve } from 'path';
import { mkdirp, readFile, writeFileP } from '../utils/fs';
import { convertIdentifierStyle } from '../utils/identifier';
import { FileAlreadyExistsError } from '../utils/error';
import { trimStart, trimEnd, escapeRegExpSpecialChars } from '../utils/string';
import config from '../utils/config';
import { ITemplate, IVariableTable } from '../model/types';

export default class CodesGenerator {
    private _template: ITemplate;
    private _destDirPath: string;

    public constructor(template: ITemplate, destDirPath: string) {
        this._template = template;
        this._destDirPath = destDirPath;
    }

    public async execute() {
        const template = this._template;
        const baseNames = await this.globDir(template.rootPath);
        const srcBaseNames = baseNames.filter(
            (fileName: string): boolean => fileName !== config.configFile
        );

        await Promise.all(
            srcBaseNames.map((srcBaseName: string) => {
                const srcPath = resolve(template.rootPath, srcBaseName);
                const destBaseName = this.resolveVariable(srcBaseName, template.variableTable);
                const destPath = resolve(this._destDirPath, destBaseName);
                return this.generate(srcPath, destPath);
            })
        );
    }

    private async generate(srcPath: string, destPath: string) {
        const exist = existsSync(destPath)

        if (statSync(srcPath).isDirectory()) {
            if(!exist) {
                await mkdirp(destPath);
            }
            const srcBaseNames = await this.globDir(srcPath);
            await Promise.all(
                srcBaseNames.map((srcBaseName: string) => {
                    const destBaseName = this.resolveVariable(
                        srcBaseName,
                        this._template.variableTable
                    );
                    return this.generate(
                        resolve(srcPath, srcBaseName),
                        resolve(destPath, destBaseName)
                    );
                })
            );
        } else {
            if(exist) {
                throw new FileAlreadyExistsError(destPath);
            }
            await this.generateFile(srcPath, destPath);
        }
    }

    private async generateFile(srcPath: string, destPath: string) {
        const encoding = config.encoding;
        const content = <string>await readFile(srcPath, { encoding });
        const resolvedContent = this.resolveVariable(content, this._template.variableTable);
        await writeFileP(destPath, resolvedContent, encoding);
    }

    private async globDir(dir: string): Promise<string[]> {
        const ignore = [...config.ignore, ...this._template.ignore];
        return new Promise<string[]>((resolve, reject) => {
            glob('*', { dot: true, cwd: dir, ignore }, (err, matches) => {
                if (err) {
                    reject(err);
                }
                resolve(matches);
            });
        });
    }

    private resolveVariable(content: string, variableTable: IVariableTable): string {
        const varLeft = config.variableLeftBoundary;
        const varRight = config.variableRightBoundary;
        let pattern;
        if (varLeft === '___' && varRight === '___') {
            pattern = /___([a-zA-Z\d-]|[a-zA-Z][_a-zA-Z\d\-]*[a-zA-Z\d-])___/g;
        } else {
            const varLeftPatternStr = escapeRegExpSpecialChars(varLeft);
            const varRightPatternStr = escapeRegExpSpecialChars(varRight);
            const patternStr = `${varLeftPatternStr}[_a-zA-Z\\d\\-]+${varRightPatternStr}`;
            pattern = new RegExp(patternStr, 'g');
        }

        return content.replace(pattern, (m: string) => {
            const key = trimStart(trimEnd(m, varRight), varLeft);
            const variable = variableTable.get(key);
            if (!variable || !variable.value) {
                return m;
            }
            return convertIdentifierStyle(variable.value, variable.style, key);
        });
    }
}
