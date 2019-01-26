import {
    workspace,
    ConfigurationChangeEvent,
    Disposable,
    ExtensionContext,
} from 'vscode';
import { existsSync, mkdirSync } from 'fs';
import { isDirectory } from '../utils/path';
import { NotDirError } from '../utils/error';
import config from '../utils/config';
import { ITemplateTable } from '../model/types';
import TemplateTable from '../model/TemplateTable';
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

    public async init(context: ExtensionContext) {
        this._extensionContext = context;
        await this.initTemplates();
    }

    public async reloadTemplates() {
        this.disposeTemplates();
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

        template.reset();
        const userInput = await getUserInput(template, destDir, this.extensionContext);
        if (!userInput) {
            return;
        }

        const { variables } = userInput;
        if (variables) {
            template.assignVariables(variables);
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

        this._templateTable = TemplateTable.getInstance(this._templatesPath);
        await this._templateTable.init();
        this.watchTemplates();
    }

    private disposeTemplates() {
        TemplateTable.freeInstance();
    }

    private watchTemplates() {
        const eventListeners = this._templatesEventListeners;
        eventListeners.push(workspace.onDidChangeConfiguration(this.onDidChangeTemplateConfig));
    }

    private onDidChangeTemplateConfig = async (e: ConfigurationChangeEvent): Promise<void> => {
        if (e.affectsConfiguration('codeTemplateTool')) {
            this.disposeTemplates();
            await this.initTemplates();
        }
    }

    private get templateTable(): ITemplateTable {
        return <ITemplateTable>this._templateTable;
    }

    private get extensionContext(): ExtensionContext {
        return <ExtensionContext>this._extensionContext;
    }

    private static _instance: Worker | undefined;
    private _templatesPath: string = '';
    private _templateTable: ITemplateTable | undefined;
    private _templatesEventListeners: Disposable[] = [];
    private _extensionContext: ExtensionContext | undefined;
}
