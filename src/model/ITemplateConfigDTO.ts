import IVariableConfigDTO from './IVariableConfigDTO';

export default interface ITemplateConfigDTO {
    name: string;
    variables?: (IVariableConfigDTO | string)[];
    encoding?: string;
    ignore?: string[];
}
