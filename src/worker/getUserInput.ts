import { window, ViewColumn, ExtensionContext, Uri } from 'vscode';
import { join } from 'path';
import { IUserInputDTO, ITemplate } from '../model/types';

interface ResolveUri {
    (diskPath: string): Uri;
}

const cssDiskPath = 'resource/css/index.css';
const jsDiskPath = 'resource/js/index.js';

function getWebviewContent(templateName: string, userInputJSON: string, resolveUri: ResolveUri) {
    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${templateName}</title>
        <link rel="stylesheet" type="text/css" href=${resolveUri(cssDiskPath)}>
    </head>
    <body>
        <div id="user-input-root">
            <h1 class="user-input-header">${templateName}</h1>
        </div>
        <script type="text/javascript" src=${resolveUri(jsDiskPath)}></script>
        <script>
            (function() {
                const { templateUserInput } = top;
                templateUserInput.start.bind(templateUserInput)(${userInputJSON});
            })()
        </script>
    </body>
</html>`;
}

export default function getUserInput(
    template: ITemplate,
    destDir: string,
    extensionContext: ExtensionContext
): Promise<IUserInputDTO | undefined> {
    function resolveUri(diskPath: string): Uri {
        const diskUri = Uri.file(join(extensionContext.extensionPath, diskPath));
        return diskUri.with({ scheme: 'vscode-resource' });
    }

    return new Promise<IUserInputDTO | undefined>(resolve => {
        const panel = window.createWebviewPanel(
            'codeTemplateVariablesSetter',
            template.name,
            ViewColumn.Active,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const variables = template.variableTable.variables();
        const userInputRequest: IUserInputDTO = {
            variables: variables.map(({ name, style, value }) => ({ name, style, value })),
            destDirPath: destDir,
        };
        const userInputRequestJSON = JSON.stringify(userInputRequest);
        panel.webview.html = getWebviewContent(
            template.name,
            userInputRequestJSON,
            resolveUri
        );
        panel.webview.onDidReceiveMessage((userInputResponse: IUserInputDTO | 'cancel') => {
            panel.dispose();
            if (userInputResponse === 'cancel') {
                resolve(undefined);
            } else {
                resolve(userInputResponse);
            }
        });
    });
}
