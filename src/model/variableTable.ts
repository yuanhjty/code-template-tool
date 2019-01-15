import { toCamelCase } from '../utils/identifier';
import IVariable from './IVariable';
import IVariableTable from './IVariableTable';
import IVariableValuesDTO from './IVariableValuesDTO';

export default class VariableTable implements IVariableTable {
    public get(key: string): IVariable | undefined {
        return this._variableTable[this.formatKey(key)];
    }

    public set(key: string, value: IVariable): void {
        this._variableTable[this.formatKey(key)] = value;
    }

    public keys(): string[] {
        return Object.keys(this._variableTable);
    }

    public values(): IVariable[] {
        return this.keys().map(key => this._variableTable[key]);
    }

    public setVariableValues(variableValues: IVariableValuesDTO): void {
        Object.keys(variableValues).forEach((key: string) => {
            this._variableTable[key].value = variableValues[key];
        });
    }

    private formatKey(key: string): string {
        return toCamelCase(key);
    }

    private _variableTable: { [key: string]: IVariable } = {};
}
