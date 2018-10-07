import { workspace } from 'vscode';
import { basename, resolve as resolvePath } from 'path';
import { existsSync, statSync } from 'fs';
import { readdir, mkdir, readFile, writeFile } from '../utils/fsAsyncApi';
import { convertCase, toCamelCase } from '../utils/identifierStyle';
import { FileAlreadyExistsError, CreationCanceledError, NoTemplateError } from '../utils/error';
import { variableInputter } from '../ui/variableInputter';
import { Template } from '../state/template';
import { Variable, VariableTable } from '../state/variable';
import editorConfig from '../state/editorConfig';

export class CodesGenerator {
    private _templateName: string;
    private _templateEncoding: string;
    private _templatePath: string;
    private _variableTable: VariableTable;
    private _destFolder: string;

    private static resolveVariable(content: string, variableTable: VariableTable): string {
        const reg = /___[_a-zA-Z\d\-]+___/g;
        return content.replace(reg, (m: string) => {
            const key = m.slice(3, -3);
            const variable = variableTable.get(toCamelCase(key));
            if (!variable || !variable.value || typeof variable.value !== 'string') {
                return m;
            }
            return convertCase(variable.value, variable.style, key);
        });
    }

    private static async getTemplateContent(templatePath: string): Promise<string[]> {
        const configFileName: string = editorConfig.templateConfigFileName;
        const fileNames = await readdir(templatePath);

        return fileNames
            .filter((fileName: string): boolean => fileName !== `${configFileName}.json`)
            .map((fileName: string) => resolvePath(templatePath, fileName));
    }

    constructor(template: Template, destFolder: string) {
        this._templateName = template.name;
        this._templateEncoding = template.encoding;
        this._templatePath = template.rootPath;
        this._variableTable = new Map(template.variables);
        this._destFolder = destFolder;
    }

    public async generateCodesFromTemplate() {
        const templateContent = await CodesGenerator.getTemplateContent(this._templatePath);
        if (!templateContent) {
            throw new NoTemplateError();
        }

        await this.getVariableValue();

        const generationProcess = [];
        for (const srcPath of templateContent) {
            const srcBasename = basename(srcPath);
            const destBasename = CodesGenerator.resolveVariable(srcBasename, this._variableTable);
            const destPath = resolvePath(this._destFolder, destBasename);
            generationProcess.push(this.generateCodes(srcPath, destPath));
        }
        await Promise.all(generationProcess);
    }

    private async generateFile(srcPath: string, destPath: string) {
        const srcEncoding = this._templateEncoding;
        const filesConfig = workspace.getConfiguration('files', null);
        const destEncoding = filesConfig.get('encoding', 'utf8');

        const content = <string>await readFile(srcPath, { encoding: srcEncoding });
        const resolvedContent = CodesGenerator.resolveVariable(content, this._variableTable);

        await writeFile(destPath, resolvedContent, destEncoding);
    }

    private async generateCodes(srcPath: string, destPath: string) {
        if (existsSync(destPath)) {
            throw new FileAlreadyExistsError(destPath);
        }

        const srcPathStat = statSync(srcPath);
        if (srcPathStat.isDirectory()) {
            await mkdir(destPath);

            const fileNames = await readdir(srcPath);
            for (const srcBasename of fileNames) {
                let destBasename = CodesGenerator.resolveVariable(srcBasename, this._variableTable);

                await this.generateCodes(
                    resolvePath(srcPath, srcBasename),
                    resolvePath(destPath, destBasename)
                );
            }
        } else {
            await this.generateFile(srcPath, destPath);
        }
    }

    private async getVariableValue() {
        const variableTable = this._variableTable;

        if (variableTable.size > 0) {
            const variables: string[] = [];
            for (const name of variableTable.keys()) {
                const variable = variableTable.get(name);
                variables.push((<Variable>variable).name);
            }

            const variableValueTable = await variableInputter(variables, this._templateName);
            if (!variableValueTable) {
                throw new CreationCanceledError();
            }

            for (const name of variableTable.keys()) {
                const variable = variableTable.get(name);
                (<Variable>variable).value = variableValueTable[name];
            }
        }
    }
}
