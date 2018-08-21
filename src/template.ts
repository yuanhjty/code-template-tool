import * as path from 'path';
import * as fs from 'fs';
import { readdir, mkdir, readFile, writeFile } from './utils/fsAsyncApi';
import { templateConfigFileName } from './utils/configInfo';
import { VariableMap, VariableConfig, resolveVariable } from './utils/variable';
import { FileAlreadyExistsError, CreationCanceledError } from './utils/error';
import { variablesInputDialog, VariablesValueObj } from './variableDialog';

export default class Template {
    public name: string = '';
    private templatePaths: string[] = [];
    private variables: { [propName: string]: VariableConfig } | undefined;
    private defPath: string;
    private configPath: string;

    public constructor(defPath: string) {
        const configPath = path.resolve(defPath, `${templateConfigFileName}.json`);
        this.configPath = configPath;
        this.defPath = defPath;
    }

    public async init() {
        await this.parseConfig();
        await this.getTemplatePaths();
    }

    public async generateCodes(destPath: string) {
        const variableMap = new VariableMap();

        if (this.variables) {
            const { variables } = this;

            const variableNames = Object.keys(variables);
            const variablesValueObj = await this.getVariablesValue(variableNames);

            variableNames.filter(name => !!variablesValueObj[name]).forEach(name => {
                const variableConfig = variables[name];
                const value = variablesValueObj[name];
                variableMap.set(name, value, variableConfig.style);
            });
        }

        for (const templateFilePath of this.templatePaths) {
            const templateFileName = path.basename(templateFilePath);
            const destFileName = resolveVariable(templateFileName, variableMap);
            const destFilePath = path.resolve(destPath, destFileName);
            await this.generate(templateFilePath, destFilePath, variableMap);
        }
    }

    private async parseConfig() {
        const configData = <string>await readFile(this.configPath, { encoding: 'utf8' });
        const configObj: {
            name: string;
            variables: (VariableConfig | string)[] | undefined;
        } = JSON.parse(configData);

        this.name = configObj.name;

        if (!Array.isArray(configObj.variables) || configObj.variables.length === 0) {
            return;
        }

        const thisVariables: { [propName: string]: VariableConfig } = {};
        configObj.variables.forEach((v: VariableConfig | string) => {
            if (typeof v === 'string') {
                thisVariables[v] = { name: v, style: 'auto' };
            } else {
                thisVariables[v.name] = v;
            }
        });
        this.variables = thisVariables;
    }

    private async getTemplatePaths() {
        const fileNames = await readdir(this.defPath);
        this.templatePaths = fileNames
            .filter((fileName: string): boolean => fileName !== `${templateConfigFileName}.json`)
            .map((fileName: string) => path.resolve(this.defPath, fileName));
    }

    private async generateFile(
        templateFilePath: string,
        destFilePath: string,
        variableMap: VariableMap
    ) {
        const content = <string>await readFile(templateFilePath, { encoding: 'utf8' });
        await writeFile(destFilePath, resolveVariable(content, variableMap));
    }

    private async generate(
        templateFilePath: string,
        destFilePath: string,
        variableMap: VariableMap
    ) {
        try {
            if (fs.existsSync(destFilePath)) {
                throw new FileAlreadyExistsError(destFilePath);
            }

            const templateStats = fs.statSync(templateFilePath);
            if (templateStats.isDirectory()) {
                await mkdir(destFilePath);
                const fileNames = await readdir(templateFilePath);

                for (const name of fileNames) {
                    let fileName = resolveVariable(name, variableMap);

                    await this.generate(
                        path.resolve(templateFilePath, name),
                        path.resolve(destFilePath, fileName),
                        variableMap
                    );
                }
            } else {
                await this.generateFile(templateFilePath, destFilePath, variableMap);
            }
        } catch (err) {
            throw err;
        }
    }

    private async getVariablesValue(variables: string[]): Promise<VariablesValueObj> {
        const variableMap = await variablesInputDialog(variables);
        if (!variableMap) {
            throw new CreationCanceledError();
        }
        return Promise.resolve(variableMap);
    }
}
