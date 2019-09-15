import { resolve } from 'path';
import { readFile } from '../utils/fs';
import { showErrMsg } from '../utils/message';
import config from '../utils/config';
import {
  ITemplate,
  ITemplateConfigDTO,
  IVariableConfigDTO,
  IVariableTable,
  IVariableValueDTO,
} from './types';
import Variable from './Variable';
import VariableTable from './VariableTable';

/**
 * A template will be uniquely identified by it's `id` property.
 */
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

  public reset(): void {
    const initialVariables = this._initialVariableTable.variables();
    this._variableTable.batchAssign(initialVariables);
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

  public get allowExistingFolder(): boolean {
    return this._allowExistingFolder;
  }

  public get variableTable(): IVariableTable {
    return this._variableTable;
  }

  public assignVariables(variableValues: IVariableValueDTO[]): void {
    this._variableTable.batchAssign(variableValues);
  }

  private constructor(templatePath: string, configDTO: ITemplateConfigDTO) {
    this._id = templatePath;
    this._name = configDTO.name;
    this._rootPath = templatePath;
    this._encoding = configDTO.encoding || config.encoding;
    this._ignore = configDTO.ignore || [];
    this._allowExistingFolder = configDTO.allowExistingFolder || false;
    this._variableTable = this.buildVariableTable(configDTO.variables || []);
    this._initialVariableTable = this.buildVariableTable(configDTO.variables || []);
  }

  private buildVariableTable(variableConfigs: (string | IVariableConfigDTO)[]): IVariableTable {
    const variableTable = new VariableTable();

    variableConfigs.forEach(cfg => {
      const variableConfigDTO = typeof cfg === 'string' ? { name: cfg } : cfg;
      const variable = new Variable(variableConfigDTO);
      variableTable.add(variable);
    });

    return variableTable;
  }

  private _id: string;
  private _name: string;
  private _rootPath: string;
  private _encoding: string;
  private _ignore: string[];
  private _allowExistingFolder: boolean;
  private _variableTable: IVariableTable;
  private _initialVariableTable: IVariableTable;
}
