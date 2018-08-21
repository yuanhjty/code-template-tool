'use strict';
import * as vscode from 'vscode';
import { handleError } from './utils/error';
import { initTemplatesCache } from './templateCache';
import newFileFromTemplate from './commands/newFileFromTemplate';
import openTemplatesFolder from './commands/openTemplatesFolder';
import refreshTemplatesCache from './commands/refreshTemplatesCache';

export async function activate(context: vscode.ExtensionContext) {
    try {
        await initTemplatesCache();

        const { subscriptions } = context;
        const { registerCommand } = vscode.commands;

        subscriptions.push(registerCommand('extension.newFile', newFileFromTemplate));
        subscriptions.push(registerCommand('extension.editTemplates', openTemplatesFolder));
        subscriptions.push(
            registerCommand('extension.reloadTemplates', refreshTemplatesCache)
        );
    } catch (err) {
        handleError(err);
    }
}

export function deactivate() {}
