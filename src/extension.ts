'use strict';
import * as vscode from 'vscode';
import { handleError } from './utils/error';
import templateTable from './state/templateTable';
import newFileFromTemplate from './controller/newFileFromTemplate';
import openTemplatesFolder from './controller/openTemplatesFolder';
import reloadTemplates from './controller/reloadTemplates';

export async function activate(context: vscode.ExtensionContext) {
    try {
        await templateTable.init();

        const { subscriptions } = context;
        const { registerCommand } = vscode.commands;

        subscriptions.push(registerCommand('extension.newFile', newFileFromTemplate));
        subscriptions.push(registerCommand('extension.editTemplates', openTemplatesFolder));
        subscriptions.push(
            registerCommand('extension.reloadTemplates', reloadTemplates)
        );
    } catch (err) {
        handleError(err);
    }
}

export function deactivate() {}
