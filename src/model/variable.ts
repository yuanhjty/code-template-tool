import { duplicate } from '../utils/string';
import { AUTO, toCamelCase } from '../utils/identifier';
import IIdentifierStyleDTO from './IIdentifierStyleDTO';
import IVariableConfigDTO from './IVariableConfigDTO';
import IVariable from './IVariable';

export default class Variable implements IVariable {
    private _name: string;
    private _value: string;
    private _style: IIdentifierStyleDTO;

    public constructor(variableConfigDTO: IVariableConfigDTO) {
        const {
            name,
            defaultValue = '',
            case: variableCase = AUTO,
            prefixUnderscore = 0,
            suffixUnderscore = 0,
            style,
        } = variableConfigDTO;
        const { rawInput = false, case: styleCase = AUTO, prefix = '', suffix = '' } = style || {};

        this._name = toCamelCase(name);
        this._value = defaultValue;
        this._style = {
            rawInput,
            case: styleCase || variableCase,
            prefix: prefix || duplicate('_', prefixUnderscore),
            suffix: suffix || duplicate('_', suffixUnderscore),
        };
    }

    public get name(): string {
        return this._name;
    }

    public get style(): IIdentifierStyleDTO {
        return this._style;
    }

    public get value(): string {
        return this._value;
    }

    public set value(v: string) {
        this._value = v;
    }
}
