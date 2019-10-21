import { statSync, existsSync } from 'fs';
import { resolve as resolvePath } from 'path';
import * as glob from 'glob';
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

  public async execute(): Promise<void> {
    const template = this._template;
    const baseNames = await this.globDir(template.rootPath);
    const srcBaseNames = baseNames.filter(
      (fileName: string): boolean => fileName !== config.configFile
    );

    await Promise.all(
      srcBaseNames.map((srcBaseName: string) => {
        const srcPath = resolvePath(template.rootPath, srcBaseName);
        const destBaseName = this.resolveVariable(srcBaseName, template.variableTable);
        const destPath = resolvePath(this._destDirPath, destBaseName);
        return this.generate(srcPath, destPath);
      })
    );
  }

  private async generate(srcPath: string, destPath: string): Promise<void> {
    const exist = existsSync(destPath);
    if (exist && !this._template.allowExistingFolder) {
      throw new FileAlreadyExistsError(destPath);
    }

    if (statSync(srcPath).isDirectory()) {
      if (!exist) {
        await mkdirp(destPath);
      }
      const srcBaseNames = await this.globDir(srcPath);
      await Promise.all(
        srcBaseNames.map((srcBaseName: string) => {
          const destBaseName = this.resolveVariable(srcBaseName, this._template.variableTable);
          return this.generate(
            resolvePath(srcPath, srcBaseName),
            resolvePath(destPath, destBaseName)
          );
        })
      );
    } else {
      if (exist) {
        throw new FileAlreadyExistsError(destPath);
      }
      await this.generateFile(srcPath, destPath);
    }
  }

  private async generateFile(srcPath: string, destPath: string): Promise<void> {
    const encoding = config.encoding;
    const content = (await readFile(srcPath, { encoding })) as string;
    const resolvedContent = this.resolveVariable(content, this._template.variableTable);
    await writeFileP(destPath, resolvedContent, encoding);
  }

  private globDir(dir: string): Promise<string[]> {
    const ignore = [...config.ignore, ...this._template.ignore];
    return new Promise<string[]>((resolve, reject): void => {
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
    const varStyle = config.variableStyleBoundary;
    const varStylePatternStr = escapeRegExpSpecialChars(varStyle);
    let pattern;
    if (varLeft === '___' && varRight === '___') {
      pattern = new RegExp(`___([a-zA-Z\d-${varStylePatternStr}]|[a-zA-Z][_a-zA-Z\d-${varStylePatternStr}]*[a-zA-Z\d-${varStylePatternStr}])___`, "g");
    } else {
      const varLeftPatternStr = escapeRegExpSpecialChars(varLeft);
      const varRightPatternStr = escapeRegExpSpecialChars(varRight);
      const patternStr = `${varLeftPatternStr}[_a-zA-Z\\d\\-${varStylePatternStr}]+${varRightPatternStr}`;
      pattern = new RegExp(patternStr, 'g');
    }

    return content.replace(pattern, (m: string) => {
      const key = trimStart(trimEnd(m, varRight), varLeft);
      const keyStyle = key.split(varStyle);
      const variable = variableTable.get(keyStyle[0]);
      if (!variable || !variable.value) {
        return m;
      }
      var style = variable.style;
      if (keyStyle.length > 1)
        style.case = keyStyle[1];
      return convertIdentifierStyle(variable.value, style, key);
    });
  }
}
