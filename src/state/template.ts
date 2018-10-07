import { resolve as resolvePath } from 'path';
import { readFile } from '../utils/fsAsyncApi';
import { toCamelCase } from '../utils/identifierStyle';
import { VariableConfig, Variable,  VariableTable } from './variable';
import editorConfig from './editorConfig';

interface ConfigObj {
    name: string;
    variables: (VariableConfig | string)[] | undefined;
    encoding?: string;
}

export class Template {
    private _name = '';
    private _encoding = '';
    private _rootPath = '';
    private _rawConfig: ConfigObj | null = null;
    private _variables: VariableTable | null = null;

    public constructor() {}

    public async init(templatePath: string) {
        this._rootPath = templatePath;
        await this.getConfig();
    }

    public get name(): string {
        return this._name;
    }

    public get encoding(): string {
        return this._encoding;
    }

    public get rootPath(): string {
        return this._rootPath;
    }

    public get variables(): VariableTable {
        if (!this._variables) {
            const configObj = this._rawConfig;
            const variables = (this._variables = new Map<string, Variable>());
            if (configObj && Array.isArray(configObj.variables)) {
                for (const item of configObj.variables) {
                    if (typeof item === 'string') {
                        const name = toCamelCase(item);
                        variables.set(name, new Variable({ name }));
                    } else {
                        const name = toCamelCase(item.name);
                        variables.set(name, new Variable({ ...item, name }));
                    }
                }
            }
        }

        return this._variables;
    }

    private async getConfig() {
        const configFileName: string = editorConfig.templateConfigFileName;
        const configPath = resolvePath(this._rootPath, `${configFileName}.json`);
        const configData = <string>(
            await readFile(configPath, { encoding: editorConfig.templateEncoding })
        );
        const configObj: ConfigObj = JSON.parse(configData);

        this._rawConfig = configObj;
        this._name = configObj.name;
        this._encoding = configObj.encoding || editorConfig.templateEncoding;
    }
}
