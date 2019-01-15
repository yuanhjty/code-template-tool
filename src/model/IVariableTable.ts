import IVariable from './IVariable';
import IVariableValuesDTO from './IVariableValuesDTO';

export default interface IVariableTable {
    get(key: string): IVariable | undefined;
    set(key: string, value: IVariable): void;
    keys(): string[];
    values():IVariable[];
    setVariableValues(variableValues: IVariableValuesDTO): void;
}
