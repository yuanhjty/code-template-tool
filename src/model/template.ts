import { resolve } from 'path';
import { readFile } from '../utils/fs';
import { showErrMsg } from '../utils/message';
import config from '../utils/config';
import ITemplateConfigDTO from './ITemplateConfigDTO';
import IVariableConfigDTO from './IVariableConfigDTO';
import IVariableValuesDTO from './IVariableValuesDTO';
import IVariableTable from './IVariableTable';
import ITemplate from './ITemplate';
import Variable from './Variable';
import VariableTable from './VariableTable';

export default class Template implements ITemplate {
    public static async createTemplate(templatePath: string): Promise<ITemplate | null> {
        const configFilePath = resolve(templatePath, config.configFile);

        let configData: string;
        try {
            configData = await readFile(configFilePath, { encoding: config.encoding });
        } catch (e) {
            showErrMsg(e.message);
            return null;
        }

        let configDTO: ITemplateConfigDTO;
        try {
            configDTO = JSON.parse(configData);
            if (!configDTO.name) {
                configDTO.name = templatePath;
            }
        } catch (e) {
            configDTO = { name: templatePath };
        }
        const template = new Template(templatePath, configDTO);
        return template;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get rootPath(): string {
        return this._rootPath;
    }

    public get encoding(): string {
        return this._encoding;
    }

    public get ignore(): string[] {
        return this._ignore;
    }

    public get variableTable(): IVariableTable {
        return this._variableTable;
    }

    public assignVariables(variableValues: IVariableValuesDTO) {
        this._variableTable.assignVariables(variableValues);
    }

    private constructor(templatePath: string, configDTO: ITemplateConfigDTO) {
        this._id = templatePath;
        this._name = configDTO.name;
        this._rootPath = templatePath;
        this._encoding = configDTO.encoding || config.encoding;
        this._ignore = configDTO.ignore || [];
        this._variableTable = this.buildVariableTable(configDTO.variables || []);
    }

    private buildVariableTable(variableConfigs: (string | IVariableConfigDTO)[]): IVariableTable {
        const variableTable = new VariableTable();
        variableConfigs.forEach(config => {
            const variableConfigDTO = typeof config === 'string' ? { name: config } : config;
            const variable = new Variable(variableConfigDTO);
            variableTable.set(variable.name, variable);
        });
        return variableTable;
    }

    private _id: string;
    private _name: string;
    private _rootPath: string;
    private _encoding: string;
    private _ignore: string[];
    private _variableTable: IVariableTable;
}
