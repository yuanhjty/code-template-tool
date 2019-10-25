import { statSync, existsSync } from 'fs';
import { resolve as resolvePath } from 'path';
import * as glob from 'glob';
import { mkdirp, readFile, writeFileP } from '../utils/fs';
import { convertIdentifierStyle } from '../utils/identifier';
import { FileAlreadyExistsError } from '../utils/error';
import { trimStart, trimEnd, escapeRegExpSpecialChars } from '../utils/string';
import config from '../utils/config';
import { ITemplate, IVariableTable, IVariable, IIdentifierStyleDTO } from '../model/types';
import Variable from '../model/Variable';

const subTemplatesDir = 'subTemplates';
export default class CodesGenerator {
  private _template: ITemplate;
  private _destDirPath: string;
  private _subTemplates: Map<string, string>;

  public constructor(template: ITemplate, destDirPath: string) {
    this._template = template;
    this._destDirPath = destDirPath;
    this._subTemplates = new Map();

    this.resolveSubTemplate = this.resolveSubTemplate.bind(this);
  }

  public async execute(): Promise<void> {
    const template = this._template;
    const baseNames = await this.globDir(template.rootPath);
    const srcBaseNames = baseNames.filter(
      (fileName: string): boolean =>
        fileName !== config.configFile && fileName.indexOf(subTemplatesDir) < 0
    );

    await this.loadSubTemplates();

    await Promise.all(
      srcBaseNames.map((srcBaseName: string) => {
        const srcPath = resolvePath(template.rootPath, srcBaseName);
        const destBaseName = this.resolveVariable(srcBaseName, template.variableTable);
        const destPath = resolvePath(this._destDirPath, destBaseName);
        return this.generate(srcPath, destPath);
      })
    );
  }

  private async loadSubTemplates() {
    const encoding = config.encoding;
    const template = this._template;
    const subTemplatesPath = resolvePath(template.rootPath, subTemplatesDir);
    const subTemplateNames = await this.globDir(subTemplatesPath);
    if (subTemplateNames && subTemplateNames.length > 0) {
      await Promise.all(
        subTemplateNames.map(async fileName => {
          const content = (await readFile(resolvePath(subTemplatesPath, fileName), {
            encoding,
          })) as string;
          this._subTemplates.set(fileName, content);
          return content;
        })
      );
    }
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
    //JRM: Add subtemplate as ignored
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
    let pattern = this.buildPattern(varStyle, varLeft, varRight);

    const contentWithSubTemplates = this.replaceVariables(
      content,
      pattern,
      variableTable.getAliases,
      this.resolveSubTemplate
    );

    return this.replaceVariables(
      contentWithSubTemplates,
      pattern,
      variableTable.get,
      this.convertStyleHelper
    );
  }

  private convertStyleHelper(variable: IVariable, key: string, style: IIdentifierStyleDTO) {
    if (!variable) {
      return '';
    }
    if (!variable.value) {
      return variable.toString() || '';
    }
    return convertIdentifierStyle(variable.value, style, key);
  }

  private replaceVariables(
    content: string,
    pattern: RegExp,
    variableGetter: (key: string) => IVariable | undefined,
    resolver: (variable: IVariable, key: string, style: IIdentifierStyleDTO) => string
  ): string {
    const varLeft = config.variableLeftBoundary;
    const varRight = config.variableRightBoundary;
    const varStyle = config.variableStyleBoundary;
    const newContent = content.replace(pattern, (m: string) => {
      const key = trimStart(trimEnd(m, varRight), varLeft);
      const keyStyle = key.split(varStyle);
      const variable = variableGetter(keyStyle[0]) || '';

      if (!variable || !variable.value) {
        return m;
      }

      var style = variable.style;
      if (keyStyle.length > 1) style.case = keyStyle[1];

      return resolver(variable, key, style);
    });
    return newContent;
  }

  private buildPattern(varStyle: string, varLeft: string, varRight: string) {
    // const varStylePatternStr = escapeRegExpSpecialChars(varStyle);
    let pattern;
    if (varLeft === '___' && varRight === '___') {
      //   /___([a-zA-Zd-:]|[a-zA-Z][_a-zA-Zd-:]*[a-zA-Zd-:])___/;
      pattern = /___([a-zA-Z\d-]|[a-zA-Z][_a-zA-Z\d-]*[a-zA-Z\d-])___/g;
      //   pattern = new RegExp(
      //     `___([a-zA-Z\d-${varStylePatternStr}]|[a-zA-Z][_a-zA-Z\d-${varStylePatternStr}]*[a-zA-Z\d-${varStylePatternStr}])___`,
      //     'g'
      //   );
    } else {
      const varLeftPatternStr = escapeRegExpSpecialChars(varLeft);
      const varRightPatternStr = escapeRegExpSpecialChars(varRight);
      const patternStr = `${varLeftPatternStr}[_a-zA-Z\\d\\-]+${varRightPatternStr}`;
      //   const patternStr = `${varLeftPatternStr}[_a-zA-Z\\d\\-${varStylePatternStr}]+${varRightPatternStr}`;
      pattern = new RegExp(patternStr, 'g');
    }
    return pattern;
  }

  private resolveSubTemplate(variable: IVariable, key: string, style: IIdentifierStyleDTO): string {
    if (!variable || !variable.value) {
      return '';
    }
    const subTemplateConfig = variable.getSubTemplates().get(key);
    if (subTemplateConfig) {
      const subTemplateContent =
        this._subTemplates.get(subTemplateConfig.file) || 'Bad subtemplate map';
      const variableSplits = variable.value.split(',');
      const content = variableSplits
        .map(v => {
          const varName = v.trim();
          let pattern = this.buildPattern(
            config.variableStyleBoundary,
            config.variableLeftBoundary,
            config.variableRightBoundary
          );

          return this.replaceVariables(
            subTemplateContent,
            pattern,
            key =>
              (key === subTemplateConfig.variableAlias &&
                new Variable({
                  name: subTemplateConfig.variableAlias,
                  defaultValue: varName,
                  style: variable.style,
                })) ||
              undefined,
            this.convertStyleHelper
          );
        })
        .join(subTemplateConfig.joinChars);
      console.log('hi');
      return content;
    }
    return '';
  }
}
