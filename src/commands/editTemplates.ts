import * as vscode from 'vscode';
import config from '../utils/config';
import { showErrMsg } from '../utils/message';

export default function editTemplates() {
    try {
        const uri = vscode.Uri.file(config.templatesPath);
        vscode.commands.executeCommand('vscode.openFolder', uri, true);
    } catch (error) {
        showErrMsg(error.message);
    }
}
