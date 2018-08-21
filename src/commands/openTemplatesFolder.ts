import * as vscode from 'vscode';
import { templatesPath } from '../utils/configInfo';
import { handleError } from '../utils/error';

export default async function openTemplatesFolder() {
    try {
        const uri = vscode.Uri.file(templatesPath);
        vscode.commands.executeCommand('vscode.openFolder', uri, true);
    } catch (err) {
        handleError(err);
    }
}
