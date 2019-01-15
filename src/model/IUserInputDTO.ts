import IVariableValuesDTO from './IVariableValuesDTO';

export default interface IUserInput {
    variableValues: IVariableValuesDTO;
    destDirPath?: string;
}
