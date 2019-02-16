import { workspace, ConfigurationChangeEvent, Disposable, ExtensionContext } from 'vscode';
import { existsSync } from 'fs';
import { isDirectory, mkdirp } from '../utils/fs';
import { NotDirError } from '../utils/error';
import config from '../utils/config';
import { ITemplateTable, IUserInputResponseDTO } from '../model/types';
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
        const { templateTable } = this;
        const template = templateTable.size() === 1 ? templateTable.entries()[0] : await selectTemplate(templateTable);
        if (!template) {
            return;
        }

        template.reset();
        const userInputResponse: IUserInputResponseDTO | undefined = await getUserInput(
            template,
            destDir,
            this.extensionContext
        );
        if (!userInputResponse) {
            return;
        }

        const { variables } = userInputResponse;
        if (variables) {
            template.assignVariables(variables);
        }
        const destDirPath = userInputResponse.destDirAbsolutePath || destDir;
        const codesGenerator = new CodesGenerator(template, destDirPath);
        await codesGenerator.execute();
    }

    private constructor() {}

    private async initTemplates() {
        this._templatesPath = config.templatesPath;
        if (!existsSync(this._templatesPath)) {
            await mkdirp(this._templatesPath);
        } else if (!isDirectory(this._templatesPath)) {
            throw new NotDirError('`codeTemplateTool.templatesPath` must be a directory, check your user settings.');
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
        eventListeners.push(workspace.onDidChangeConfiguration(this.onDidChangeTemplateConfig.bind(this)));
    }

    private async onDidChangeTemplateConfig (e: ConfigurationChangeEvent): Promise<void> {
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
