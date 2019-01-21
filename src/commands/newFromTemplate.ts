import { getDestDirPath } from '../utils/path';
import { showErrMsg } from '../utils/message';
import Worker from '../worker/Worker';

export default async function newFromTemplate(...contextArgs: any[]) {
    try {
        const destDir = getDestDirPath(...contextArgs);
        if (!destDir) {
            return;
        }
        const worker = Worker.getInstance();
        await worker.generateCodes(destDir);
    } catch (error) {
        showErrMsg(error.message);
    }
}
