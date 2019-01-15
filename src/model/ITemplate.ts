import IVariableTable from './IVariableTable';
import IVariableValuesDTO from './IVariableValuesDTO';

export default interface ITemplate {
    setVariableValues(variableValues: IVariableValuesDTO): void;
    name: string;
    encoding: string;
    ignore: string[];
    rootPath: string;
    variableTable: IVariableTable;
}
