import IIdentifierStyleDTO from './IIdentifierStyleDTO';

export default interface IVariable {
    name: string;
    style: IIdentifierStyleDTO;
    value: string;
}
