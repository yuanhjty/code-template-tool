'use strict';
import { ExtensionContext, commands } from 'vscode';
import commandTable from './commands';
import Worker from './worker/Worker';

export async function activate(context: ExtensionContext) {
    const worker = Worker.getInstance();
    await worker.init();

    const { subscriptions } = context;
    const { registerCommand } = commands;

    Object.keys(commandTable).forEach(key => {
        subscriptions.push(registerCommand(key, commandTable[key]));
    });
}

export function deactivate() {}
