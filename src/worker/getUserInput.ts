import { relative, resolve as resolvePath } from 'path';
import { window, ViewColumn, ExtensionContext, Uri, Webview } from 'vscode';
import { getWorkspacePath } from '../utils/path';
import config from '../utils/config';
import {
  IUserInputRequestDTO,
  IUserInputResponseDTO,
  ITemplate,
  IVariableDTO,
} from '../model/types';

interface ResolveUri {
  (diskPath: string): Uri;
}

const cssDiskPath = 'resource/css/index.css';
const jsDiskPath = 'resource/js/index.js';

/* eslint-disable func-names */
function getWebviewContent(
  templateName: string,
  userInputRequest: IUserInputRequestDTO,
  resolveUri: ResolveUri,
  webview: Webview,
  nonce: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
  webview.cspSource
}; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName}</title>
    <link rel="stylesheet" type="text/css" href="${resolveUri(cssDiskPath)}">
  </head>
  <body>
    <div id="user-input-root"></div>
    <script nonce="${nonce}" src="${resolveUri(jsDiskPath)}"></script>
    <script nonce="${nonce}">
      (function() {
        const { templateUserInput } = window;
        templateUserInput.start.bind(templateUserInput)(
          ${JSON.stringify(userInputRequest)}
        );
      })()
    </script>
  </body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default function getUserInput(
  template: ITemplate,
  destDir: string,
  extensionContext: ExtensionContext
): Promise<IUserInputResponseDTO | undefined> {
  const workspacePath = getWorkspacePath();
  const destDirRelativePath = relative(workspacePath, destDir);
  const templateName = template.name;

  return new Promise<IUserInputResponseDTO | undefined>((resolve): void => {
    const panel = window.createWebviewPanel(
      'codeTemplateVariablesSetter',
      templateName,
      ViewColumn.Active,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    const vars = template.variableTable.variables();
    const userInputRequest: IUserInputRequestDTO = {
      templateName,
      variables: vars.map(({ name, style, value }) => ({ name, style, value })),
      destDir: {
        basePath: workspacePath,
        relativePath: destDirRelativePath,
      },
      inputConfig: {
        confirmOnEnter: config.userInputConfirmOnEnter,
        cancelOnEscape: config.userInputCancelOnEscape,
      },
    };
    const resolveUri = (diskPath: string): Uri => {
      const diskUri = Uri.file(resolvePath(extensionContext.extensionPath, diskPath));
      if (panel.webview.asWebviewUri) {
        return panel.webview.asWebviewUri(diskUri);
      }
      return diskUri.with({ scheme: 'vscode-resource' });
    };
    panel.webview.html = getWebviewContent(
      templateName,
      userInputRequest,
      resolveUri,
      panel.webview,
      getNonce()
    );
    panel.webview.onDidReceiveMessage(response => {
      panel.dispose();
      if (response === 'cancel') {
        resolve(undefined);
      } else {
        const {
          variables,
          destDir: { basePath, relativePath },
        } = response;
        const userInputResponse: IUserInputResponseDTO = {
          variables: variables as IVariableDTO[],
          destDirAbsolutePath: resolvePath(basePath || '/', relativePath),
        };
        resolve(userInputResponse);
      }
    });
  });
}
