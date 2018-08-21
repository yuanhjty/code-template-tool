import * as path from 'path';
import * as ErrorTypes from './error';
import { showErrMsg, showInfoMsg } from './message';

export class FileAlreadyExistsError extends Error {
    constructor(filePath: string) {
        super(`"${path.resolve(filePath)}" already exists!`);
    }
}

export class CreationCanceledError extends Error {
    constructor() {
        super('The creation is canceled!');
    }
}

export class NoTemplateError extends Error {
    constructor() {
        super('No template found!');
    }
}

export function handleError(err: any) {
    switch (true) {
        case err instanceof ErrorTypes.CreationCanceledError:
            showInfoMsg(err.message);
            break;
        case err instanceof ErrorTypes.NoTemplateError:
        case err instanceof ErrorTypes.FileAlreadyExistsError:
        default:
            showErrMsg(err.message);
            break;
    }
}
