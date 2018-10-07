import { workspace } from 'vscode';
import { resolve as resolvePath } from 'path';
import { homedir } from 'os';

const templateConfig = {
    config: 'codeTemplateTool',
    encoding: 'templateConfigEncoding',
    templatesPath: 'templatesPath',
    templateConfigFileName: 'templateConfigFileName',
};

class EditorConfig {
    private static _instance: EditorConfig | null = null;
    private static _defaultTemplatesPath = resolvePath(homedir(), '.vscode/templates');
    private static _defaultTemplateConfigFileName = 'template.config';

    private constructor() {}

    public static getInstance() {
        return EditorConfig._instance || (this._instance = new this());
    }

    public get(field: string): any {
        const codeTemplateConfig = workspace.getConfiguration(templateConfig.config);
        return codeTemplateConfig.get<any>(field);
    }

    public get templatesPath(): string {
        return this.get(templateConfig.templatesPath) || EditorConfig._defaultTemplatesPath;
    }

    public get templateConfigFileName(): string {
        return (
            this.get(templateConfig.templateConfigFileName) ||
            EditorConfig._defaultTemplateConfigFileName
        );
    }

    public get templateEncoding(): string {
        const filesConfig = workspace.getConfiguration('files', null);
        return (
            this.get(templateConfig.encoding) ||
            filesConfig.get('encoding', 'utf8')
        );
    }
}

export default EditorConfig.getInstance();
