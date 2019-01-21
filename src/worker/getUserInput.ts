import { window, ViewColumn } from 'vscode';
import IUserInputDTO from '../model/IUserInputDTO';
import ITemplate from '../model/ITemplate';

function createView(variables: string[], templateName?: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set ${templateName ? templateName + ' ' : ''}Variables</title>
    <style>
        #code-template-variable-map {
            margin: 20px;
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        .code-template-title {
            text-align: center;
        }
        .code-template-item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 8px 0;
            padding-right: 20%;
        }
        .code-template-label {
            padding: 4px 12px;
            text-align: right;
            width: 50%;
        }
        .code-template-value {
            padding: 4px 8px;
            text-align: left;
            width: 50%;
        }
        .code-template-submit-btn {
            margin: 20px;
            padding: 8px;
            text-align: center;
            width: 100px;
        }
        .code-template-submit-btn:focus {
            outline: none;
        }
        .code-template-cancel-btn {
            width: 100px;
        }
    </style>
</head>
<body>
    <h2 class="code-template-title">Set ${templateName ? templateName + ' ' : ''}Variables</h2>
    <form id="code-template-variable-map">
    </form>

    <script>
        (function() {
            const variablesStr = '${variables.join(' ')}';
            console.log(variablesStr)
            const variables = variablesStr ? variablesStr.split(' ') : [];

            const vscode = acquireVsCodeApi();

            function handleSubmit(e) {
                e.preventDefault();
                const { target } = e;
                const variableValues = {};

                variables.forEach((v) => {
                    variableValues[v] = target[v].value;
                });

                vscode.postMessage({ variableValues });
            }

            function handleCancel(e) {
                e.preventDefault();
                vscode.postMessage('cancel');
            }

            const formEl = document.getElementById('code-template-variable-map');

            console.log(variables)
            variables.forEach((v) => {
                const divEl = document.createElement('div');
                const labelEl = document.createElement('label');
                const inputEl = document.createElement('input');

                divEl.className='code-template-item'
                labelEl.className = 'code-template-label';
                labelEl.textContent = v;
                inputEl.className = 'code-template-value';
                inputEl.name = v;

                divEl.appendChild(labelEl);
                divEl.appendChild(inputEl);
                formEl.appendChild(divEl);
            });

            const footerEl = document.createElement('div');
            const submitEl = document.createElement('input');
            const cancelEl = document.createElement('button');

            footerEl.className = 'code-template-item';
            submitEl.type = 'submit';
            submitEl.value = 'OK';
            submitEl.className = 'code-template-submit-btn';
            cancelEl.textContent = 'CANCEL';
            cancelEl.className = 'code-template-cancel-btn';

            footerEl.appendChild(submitEl);
            footerEl.appendChild(cancelEl);
            formEl.appendChild(footerEl);

            formEl.addEventListener('submit', handleSubmit);
            cancelEl.addEventListener('click', handleCancel);
        }())
    </script>
</body>
</html>`;
}

export default function getUserInput(template: ITemplate, destDir: string = ''): Promise<IUserInputDTO | undefined> {
    const { variableTable: variableTable, name: templateName } = template;
    return new Promise<IUserInputDTO | undefined>(resolve => {
        const panel = window.createWebviewPanel(
            'codeTemplateVariablesSetter',
            `${templateName ? templateName + ' ' : ''}Variables`,
            ViewColumn.Active,
            { enableScripts: true }
        );
        panel.webview.html = createView(Array.from(variableTable.keys()), templateName);
        panel.webview.onDidReceiveMessage(message => {
            panel.dispose();
            if (message === 'cancel') {
                resolve(undefined);
            }
            resolve(message);
        });
    });
}
