import { commands, Uri } from 'vscode';
import config from '../utils/config';
import { showErrMsg } from '../utils/message';

export default function editTemplates(): void {
  try {
    const uri = Uri.file(config.templatesPath);
    commands.executeCommand('vscode.openFolder', uri, true);
  } catch (error) {
    showErrMsg(error.message);
  }
}
