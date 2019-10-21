import { resolve } from 'path';
import { homedir } from 'os';
import { workspace } from 'vscode';
import { trim } from './string';
import { flipCurry } from './function';
import { resolveParams } from './path';

const filesConfig = workspace.getConfiguration('files', null);
const defaultTemplatesPath = resolve(homedir(), '.vscode/templates');
const defaultConfigFile = 'template.config.json';
const defaultIgnore: string[] = [];
const defaultEncoding = filesConfig.get('encoding', 'utf8');
const defaultVariableLeftBoundary = '{_';
const defaultVariableRightBoundary = '_}';
const defaultVariableStyleBoundary = ':';
const defaultUserInputConfirmOnEnter = false;
const defaultUserInputCancelOnEscape = false;

const trimSpace: (str: string) => string = flipCurry(trim)(' ');

const config = {
  getPluginConfiguration(field: string): any {
    return workspace.getConfiguration('codeTemplateTool').get(field);
  },

  get templatesPath(): string {
    const templatesPath = trimSpace(this.getPluginConfiguration('templatesPath'));
    const resolvedPath = resolveParams(templatesPath);
    if (resolvedPath.slice(0, 2) === '~/') {
      return resolve(homedir(), templatesPath.slice(2));
    }
    return resolvedPath || defaultTemplatesPath;
  },

  get ignore(): string[] {
    return this.getPluginConfiguration('ignore') || defaultIgnore;
  },

  get configFile(): string {
    return trimSpace(this.getPluginConfiguration('configFile')) || defaultConfigFile;
  },

  get encoding(): string {
    return trimSpace(this.getPluginConfiguration('encoding')) || defaultEncoding;
  },

  get variableNoTransformation(): boolean {
    return this.getPluginConfiguration('variable.noTransformation');
  },

  get variableKeepUpperCase(): boolean {
    return this.getPluginConfiguration('variable.keepUpperCase');
  },

  get variableLeftBoundary(): string {
    return (
      trimSpace(this.getPluginConfiguration('variable.leftBoundary')) || defaultVariableLeftBoundary
    );
  },

  get variableRightBoundary(): string {
    return (
      trimSpace(this.getPluginConfiguration('variable.rightBoundary')) ||
      defaultVariableRightBoundary
    );
  },

  get variableStyleBoundary(): string {
    return (
      trimSpace(this.getPluginConfiguration('variable.styleBoundary')) ||
      defaultVariableStyleBoundary
    );
  },

  get userInputConfirmOnEnter(): boolean {
    return (
      this.getPluginConfiguration('userInput.confirmOnEnter') || defaultUserInputConfirmOnEnter
    );
  },

  get userInputCancelOnEscape(): boolean {
    return (
      this.getPluginConfiguration('userInput.cancelOnEscape') || defaultUserInputCancelOnEscape
    );
  },
};

export default config;
