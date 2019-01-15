import IIdentifierStyleDTO from './IIdentifierStyleDTO';

export default interface IVariableConfigDTO {
    name: string;
    defaultValue?: string;
    style?: IIdentifierStyleDTO;

    // For Compatibility
    case?: string;
    prefixUnderscore?: number;
    suffixUnderscore?: number;
}
