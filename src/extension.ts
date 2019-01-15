'use strict';
import * as vscode from 'vscode';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    const { subscriptions } = context;
    const { registerCommand } = vscode.commands;

    Object.keys(commands).forEach(key => {
        subscriptions.push(registerCommand(key, commands[key]));
    });
}

export function deactivate() {}
