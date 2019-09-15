export interface IIdentifierStyleDTO {
  noTransformation?: boolean;
  keepUpperCase?: boolean;
  case: string;
  prefix: string;
  suffix: string;
}

export interface IVariableConfigDTO {
  name: string;
  defaultValue?: string;
  style?: IIdentifierStyleDTO;

  // For Compatibility
  case?: string;
  prefixUnderscore?: number;
  suffixUnderscore?: number;
}

export interface ITemplateConfigDTO {
  name: string;
  variables?: (IVariableConfigDTO | string)[];
  encoding?: string;
  ignore?: string[];
  allowExistingFolder?: boolean;
}

export interface IVariableValueDTO {
  name: string;
  value: string | undefined;
}

export interface IVariableDTO extends IVariableValueDTO {
  style: IIdentifierStyleDTO;
}

export interface IUserInputRequestDTO {
  templateName: string;
  variables: IVariableDTO[];
  destDir: {
    basePath: string;
    relativePath: string;
  };
  inputConfig: {
    confirmOnEnter: boolean;
    cancelOnEscape: boolean;
  };
}

export interface IUserInputResponseDTO {
  variables: IVariableDTO[];
  destDirAbsolutePath: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVariable extends IVariableDTO {}

export interface IVariableTable {
  get(variableName: string): IVariable | undefined;
  add(variable: IVariable): void;
  delete(variableName: string): void;
  variables(): IVariable[];
  batchAssign(variableValues: IVariableValueDTO[]): void;
}

export interface ITemplate {
  reset(): void;
  assignVariables(variableValues: IVariableValueDTO[]): void;
  id: string;
  name: string;
  encoding: string;
  ignore: string[];
  allowExistingFolder: boolean;
  rootPath: string;
  variableTable: IVariableTable;
}

export interface ITemplateTable {
  init(): Promise<void>;
  getById(templateId: string): ITemplate | undefined;
  getByName(templateName: string): ITemplate | undefined;
  add(template: ITemplate): void;
  deleteByName(templateName: string): void;
  deleteById(templateId: string): void;
  entries(): ITemplate[];
  size(): number;
}
