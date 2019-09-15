import { window } from 'vscode';

const { showErrorMessage, showInformationMessage } = window;

export function showErrMsg(msg: string): void {
  showErrorMessage(`code-template-tool: ${msg}`);
}

export function showInfoMsg(msg: string): void {
  showInformationMessage(`code-template-tool: ${msg}`);
}
