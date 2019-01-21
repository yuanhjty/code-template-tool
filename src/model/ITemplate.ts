import IVariableTable from './IVariableTable';
import IVariableValuesDTO from './IVariableValuesDTO';

export default interface ITemplate {
    assignVariables(variableValues: IVariableValuesDTO): void;
    id: string;
    name: string;
    encoding: string;
    ignore: string[];
    rootPath: string;
    variableTable: IVariableTable;
}
