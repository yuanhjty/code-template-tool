import { resolve as resolvePath } from 'path';
import { statSync, existsSync } from 'fs';
import { readdir, mkdir } from '../utils/fsAsyncApi';
import { Template } from './template';
import editorConfig from './editorConfig';

export class TemplateTable {
    private static _instance: TemplateTable | null = null;
    private _templates = new Map<string, Template>();

    private constructor() {}

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    public async init() {
        await this.buildTemplates();
    }

    public async update() {
        this.clear();
        await this.buildTemplates();
    }

    public destroy() {
        TemplateTable._instance = null;
    }

    public async buildTemplates() {
        const templatesPath: string = editorConfig.templatesPath;

        if (!existsSync(templatesPath)) {
            await mkdir(templatesPath);
        }

        const fileNames: string[] = await readdir(templatesPath);
        const validFileNames = fileNames.filter((name: string) => name[0] !== '.');

        const buildingProcess = [];
        for (const fileName of validFileNames) {
            const templatePath = resolvePath(templatesPath, fileName);
            buildingProcess.push(this.buildTemplate(templatePath));
        }
        await Promise.all(buildingProcess);
    }

    private async buildTemplate(templatePath: string) {
        const stat = statSync(templatePath);
        if (stat.isDirectory()) {
            const template = new Template();
            await template.init(templatePath);
            this.addTemplate(template);
        }
    }

    public addTemplate(template: Template) {
        this._templates.set(template.name, template);
    }

    public getTemplate(name: string): Template {
        return <Template>(this._templates.get(name));
    }

    public getTemplates(): Template[] {
        return Array.from(this._templates.values());
    }

    public getTemplateNames(): string[] {
        return Array.from(this._templates.keys());
    }

    public removeTemplate(name: string) {
        this._templates.delete(name);
    }

    public clear() {
        this._templates.clear();
    }
}

export default TemplateTable.getInstance();
