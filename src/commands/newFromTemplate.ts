import { getDestDirPath } from '../utils/path';
import { showErrMsg } from '../utils/message';
import Worker from '../worker/Worker';

export default async function newFromTemplate(...contextArgs: any[]): Promise<void> {
  try {
    const destDir = getDestDirPath(...contextArgs);
    const worker = Worker.getInstance();
    await worker.generateCodes(destDir);
  } catch (error) {
    showErrMsg(error.message);
  }
}
