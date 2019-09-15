import { toCamelCase } from '../utils/identifier';
import { IVariableTable, IVariableValueDTO, IVariable } from './types';

export default class VariableTable implements IVariableTable {
  public get(variableName: string): IVariable | undefined {
    return this._table.get(this.normalizeName(variableName));
  }

  /**
   * Add a variable into the variable table.
   * If the variable table already has the same variable, cover it with the new one.
   */
  public add(variable: IVariable): void {
    this._table.set(this.normalizeName(variable.name), variable);
  }

  public delete(variableName: string): void {
    this._table.delete(this.normalizeName(variableName));
  }

  public variables(): IVariable[] {
    return Array.from(this._table.values());
  }

  public batchAssign(variableValues: IVariableValueDTO[]): void {
    variableValues.forEach((item: IVariableValueDTO) => {
      const variable = this.get(item.name);
      if (variable) {
        variable.value = item.value;
      }
    });
  }

  private normalizeName(variableName: string): string {
    return toCamelCase(variableName);
  }

  private _table = new Map<string, IVariable>();
}
