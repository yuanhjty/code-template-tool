import { statSync } from 'fs';
import { dirname, resolve } from 'path';
import { homedir } from 'os';
import { workspace, window } from 'vscode';
import { pipe } from './function';

function parseDirPath(filePath: string | undefined): string | undefined {
  if (!filePath) {
    return undefined;
  }

  try {
    const stats = statSync(filePath);
    const folderPath = stats.isDirectory() ? filePath : dirname(filePath);
    return resolve(folderPath);
  } catch (e) {}

  return undefined;
}

function getCurrentDirPath(): string | undefined {
  const activeEditor = window.activeTextEditor;
  const filePath = activeEditor && activeEditor.document.fileName;
  return parseDirPath(filePath);
}

function getSelectedDirPath(...contextArgs: any[]): string | undefined {
  const selectedPath = contextArgs[0] && contextArgs[0].fsPath;
  return parseDirPath(selectedPath);
}

export function getWorkspacePath(): string {
  const { workspaceFolders } = workspace;
  const workspaceFolder = workspaceFolders && workspaceFolders[0];
  if (!workspaceFolder) {
    return homedir();
  }
  return workspaceFolder.uri.fsPath;
}

export function getDestDirPath(...contextArgs: any[]): string {
  return getSelectedDirPath(...contextArgs) || getCurrentDirPath() || getWorkspacePath();
}

/**
 * Resolve params in path
 */
export const resolveParams = (function getResolvePath(): (str: string) => string {
  const params = [['{home}', homedir()], ['{workspace}', getWorkspacePath()]];

  function getReplacer(subStr: string, newSubStr: string): (str: string) => string {
    return (str: string): string => str.replace(subStr, newSubStr);
  }

  const replacers = params.map(item => getReplacer(item[0], item[1]));

  return function resolvePath(path: string): string {
    return pipe(...replacers)(path);
  };
})();
