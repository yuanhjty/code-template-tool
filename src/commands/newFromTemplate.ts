import { getDestDirPath } from '../utils/path';
import { showErrMsg } from '../utils/message';
import generateTargetCodes from '../worker/generateTargetCodes';

export default async function newFromTemplate(...contextArgs: any[]) {
    try {
        const destDir = getDestDirPath(...contextArgs);
        await generateTargetCodes(destDir);
    } catch (error) {
        showErrMsg(error.message);
    }
}
