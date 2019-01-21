import { workspace, Uri, RelativePattern, ConfigurationChangeEvent, Disposable } from 'vscode';
import { normalize, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { isDirectory } from '../utils/path';
import { NotDirError } from '../utils/error';
import config from '../utils/config';
import ITemplateTable from '../model/ITemplateTable';
import TemplateTable from '../model/TemplateTable';
import Template from '../model/Template';
import CodesGenerator from './CodesGenerator';
import selectTemplate from './selectTemplate';
import getUserInput from './getUserInput';

export default class Worker {
    public static getInstance(): Worker {
        if (!this._instance) {
            this._instance = new Worker();
        }
        return this._instance;
    }

    public async init() {
        await this.initTemplates();
    }

    public dispose() {
        this.disposeTemplates();
    }

    public async generateCodes(destDir: string) {
        const template = await selectTemplate(this.templateTable);
        if (!template) {
            return;
        }

        const userInput = await getUserInput(template, destDir);
        if (!userInput) {
            return;
        }

        if (userInput.variableValues) {
            template.assignVariables(userInput.variableValues);
        }
        const destDirPath = userInput.destDirPath || destDir;
        const codesGenerator = new CodesGenerator(template, destDirPath);
        await codesGenerator.execute();
    }

    private constructor() {}

    private async initTemplates() {
        this._templatesPath = config.templatesPath;
        if (!existsSync(this._templatesPath)) {
            mkdirSync(this._templatesPath);
        } else if (!isDirectory(this._templatesPath)) {
            throw new NotDirError(
                '`codeTemplateTool.templatesPath` must be a directory, check your user settings.'
            );
        }

        this._templateConfigFile = config.configFile;
        this._templateTable = TemplateTable.getInstance(this._templatesPath);
        await this._templateTable.init();
        this.registerTemplatesWatcher();
    }

    private disposeTemplates() {
        this._templatesEventListeners.forEach(listener => {
            listener.dispose();
        });
        TemplateTable.freeInstance();
    }

    private registerTemplatesWatcher() {
        const { createFileSystemWatcher } = workspace;
        const templatesPath = this._templatesPath;
        const templateConfigFilePattern = new RelativePattern(
            templatesPath,
            `*/${this._templateConfigFile}`
        );
        const templateDirectoryPattern = new RelativePattern(templatesPath, '*');
        const templateConfigFileWatcher = createFileSystemWatcher(templateConfigFilePattern);
        const templateDirectoryWatcher = createFileSystemWatcher(templateDirectoryPattern);

        const eventListeners = this._templatesEventListeners;
        eventListeners.push(templateConfigFileWatcher.onDidChange(this.onDidChangeTemplate));
        eventListeners.push(templateConfigFileWatcher.onDidCreate(this.onDidCreateTemplate));
        eventListeners.push(templateConfigFileWatcher.onDidDelete(this.onDidDeleteTemplateConfigFile));
        eventListeners.push(templateDirectoryWatcher.onDidDelete(this.onDidDeleteTemplateDirectory));
        eventListeners.push(workspace.onDidChangeConfiguration(this.onDidChangeTemplateConfig));
    }

    private onDidChangeTemplate = async (uri: Uri) => {
        const templatePath = this.getDir(uri);
        this.templateTable.deleteTemplate(templatePath);
        const template = await Template.createTemplate(templatePath);
        if (template) {
            this.templateTable.addTemplate(template);
        }
    }

    private onDidCreateTemplate = async (uri: Uri) => {
        const templatePath = this.getDir(uri);
        const template = await Template.createTemplate(templatePath);
        if (template) {
            this.templateTable.addTemplate(template);
        }
    }

    private onDidDeleteTemplateConfigFile = (uri: Uri) => {
        const templatePath = this.getDir(uri);
        this.templateTable.deleteTemplate(templatePath);
    }

    private onDidDeleteTemplateDirectory = (uri: Uri) => {
        const templatePath = normalize(uri.fsPath);
        this.templateTable.deleteTemplate(templatePath);
    }

    private getDir = (uri: Uri): string => {
        const normalizedPath = normalize(uri.fsPath);
        return dirname(normalizedPath);
    }

    private onDidChangeTemplateConfig = (e: ConfigurationChangeEvent) => {
        if (e.affectsConfiguration('codeTemplateTool')) {
            this.disposeTemplates();
            this.initTemplates();
        }
    }

    private get templateTable(): ITemplateTable {
        return <ITemplateTable>this._templateTable;
    }

    private static _instance: Worker | undefined;
    private _templatesPath: string = '';
    private _templateConfigFile: string = '';
    private _templateTable: ITemplateTable | undefined;
    private _templatesEventListeners: Disposable[] = [];
}
