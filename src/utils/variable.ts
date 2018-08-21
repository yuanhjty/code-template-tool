import { toCamelCase, convertCase } from './identifierStyle';

export interface VariableDef {
    value: string;
    style: string;
}

export interface VariableMapInner {
    [propName: string]: VariableDef;
}

export class VariableMap {
    private map: VariableMapInner = {};

    public set(variableName: string, variableValue: string, variableCase: string) {
        this.map[toCamelCase(variableName)] = {
            value: variableValue,
            style: variableCase,
        };
    }

    public get(key: string): VariableDef | undefined {
        return this.map[toCamelCase(key)];
    }
}

export interface VariableConfig {
    name: string;
    style: string;
}

export function resolveVariable(data: string, variableMap: VariableMap): string {
    const reg = /___[_a-zA-Z\d\-]+___/g;
    return data.replace(reg, (m: string) => {
        const key = m.slice(2, -2);
        const variable = variableMap.get(key);
        if (!variable || !variable.value) {
            return m;
        }
        return convertCase(variable.value, variable.style, key);
    });
}
