'use strict';
import { ExtensionContext, commands } from 'vscode';
import commandTable from './commands';
import Worker from './worker/Worker';

export async function activate(context: ExtensionContext): Promise<void> {
  const worker = Worker.getInstance();
  await worker.init(context);

  const { subscriptions } = context;
  const { registerCommand } = commands;

  Object.keys(commandTable).forEach(key => {
    subscriptions.push(registerCommand(key, commandTable[key]));
  });
}

export function deactivate(): void {
  // empty
}
