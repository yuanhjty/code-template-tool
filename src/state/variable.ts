export interface VariableConfig {
    name: string;
    case?: string;
    prefixUnderscore?: number;
    suffixUnderscore?: number;
}

export interface VariableStyle {
    case: string;
    prefixUnderscore: number;
    suffixUnderscore: number;
}

export class Variable {
    private _name: string;
    private _value?: string;
    private _style: VariableStyle;

    public constructor(config: VariableConfig) {
        const { name, case: styleCase, prefixUnderscore, suffixUnderscore } = config;
        this._name = name;
        this._style = {
            case: styleCase || 'auto',
            prefixUnderscore: prefixUnderscore || 0,
            suffixUnderscore: suffixUnderscore || 0,
        };
    }

    public get name() {
        return this._name;
    }

    public get style() {
        return this._style;
    }

    public get value() {
        return this._value;
    }

    public set value(v: string | undefined) {
        this._value = v;
    }
}

export type VariableTable = Map<string, Variable>;
