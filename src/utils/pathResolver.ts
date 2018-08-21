import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function resolveFolderPath(filePath: string): string | null {
    if (!filePath) {
        return null;
    }
    try {
        const stats = fs.statSync(filePath);
        const folderPath = stats.isDirectory() ? filePath : path.dirname(filePath);
        return path.resolve(folderPath);
    } catch (err) {
        throw err;
    }
}

export function resolveWorkspacePath(): string | null {
    const { workspaceFolders = [] } = vscode.workspace;
    const workspaceFolder = workspaceFolders[0];
    return (workspaceFolder && workspaceFolder.uri.fsPath) || null;
}

export function resolveCurrentFolderPath(): string | null {
    const activeEditor = vscode.window.activeTextEditor;
    const filePath = activeEditor && activeEditor.document.fileName;
    return resolveFolderPath(filePath || '');
}

export function resolveSelectedFolderPath(...thisArgs: any[]): string | null {
    const selectedPath = thisArgs[0] && thisArgs[0].fsPath;
    return resolveFolderPath(selectedPath || '');
}

export function resolveTargetFolderPath(thisArgs: any): string | null {
    return (
        resolveSelectedFolderPath(thisArgs) || resolveCurrentFolderPath() || resolveWorkspacePath()
    );
}
