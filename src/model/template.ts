import config from '../utils/config';
import ITemplateConfigDTO from './ITemplateConfigDTO';
import IVariableConfigDTO from './IVariableConfigDTO';
import IVariableValuesDTO from './IVariableValuesDTO';
import IVariableTable from './IVariableTable';
import ITemplate from './ITemplate';
import Variable from './Variable';
import VariableTable from './VariableTable';

export default class Template implements ITemplate {
    private _name: string;
    private _encoding: string;
    private _ignore: string[];
    private _rootPath: string;
    private _variableTable: IVariableTable;

    constructor(templatePath: string, configDTO: ITemplateConfigDTO) {
        this._name = configDTO.name;
        this._encoding = configDTO.encoding || config.encoding;
        this._ignore = configDTO.ignore || [];
        this._rootPath = templatePath;
        this._variableTable = this.getVariableTable(configDTO.variables);
    }

    public get name(): string {
        return this._name;
    }

    public get encoding(): string {
        return this._encoding;
    }

    public get ignore(): string[] {
        return this._ignore;
    }

    public get rootPath(): string {
        return this._rootPath;
    }

    public get variableTable(): IVariableTable {
        return this._variableTable;
    }

    public setVariableValues(variableValues: IVariableValuesDTO) {
        this._variableTable.setVariableValues(variableValues);
    }

    private getVariableTable(
        variableConfigs: (string | IVariableConfigDTO)[] | undefined
    ): IVariableTable {
        const variableTable = new VariableTable();
        if (variableConfigs) {
            variableConfigs.forEach(config => {
                const variableConfigDTO = typeof config === 'string' ? { name: config } : config;
                const variable = new Variable(variableConfigDTO);
                variableTable.set(variable.name, variable);
            });
        }
        return variableTable;
    }
}
