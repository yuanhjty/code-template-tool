import config from '../utils/config';
import { duplicate } from '../utils/string';
import { AUTO, toCamelCase } from '../utils/identifier';
import {
  IVariable,
  IVariableConfigDTO,
  IIdentifierStyleDTO,
  ISubTemplateVariableConfigDTO,
} from './types';

/**
 * A variable will be uniquely identified by it's `name` property.
 */
export default class Variable implements IVariable {
  public constructor(variableConfigDTO: IVariableConfigDTO) {
    const {
      name,
      defaultValue,
      style,
      case: variableCase = AUTO,
      prefixUnderscore = 0,
      suffixUnderscore = 0,
      subTemplates,
    } = variableConfigDTO;
    const {
      noTransformation = void 0,
      keepUpperCase = void 0,
      case: styleCase = AUTO,
      prefix = '',
      suffix = '',
    } = style || {};

    this._name = this.normalizeName(name);
    this._value = defaultValue;
    this._style = {
      noTransformation: noTransformation || config.variableNoTransformation,
      keepUpperCase: keepUpperCase || config.variableKeepUpperCase,
      case: styleCase || variableCase,
      prefix: prefix || duplicate('_', prefixUnderscore),
      suffix: suffix || duplicate('_', suffixUnderscore),
    };

    if (subTemplates && subTemplates.length > 0) {
      subTemplates.forEach(template => this._subTemplates.set(template.as, template));
    }

    this.getSubTemplates = this.getSubTemplates.bind(this);
  }

  public get name(): string {
    return this._name;
  }

  public get style(): IIdentifierStyleDTO {
    return this._style;
  }

  public get value(): string | undefined {
    return this._value;
  }

  public set value(val: string | undefined) {
    this._value = val;
  }

  public get hasSubTemplates() {
    return this._subTemplates.size > 0;
  }

  public getSubTemplates() {
    return this._subTemplates;
  }

  private normalizeName(name: string): string {
    return toCamelCase(name);
  }

  private _name: string;
  private _value: string | undefined;
  private _style: IIdentifierStyleDTO;
  private _subTemplates = new Map<string, ISubTemplateVariableConfigDTO>();
}
