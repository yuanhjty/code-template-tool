import { readdirSync } from 'fs';
import { normalize, resolve } from 'path';
import { isDirectory } from '../utils/path';
import ITemplateTable from './ITemplateTable';
import ITemplate from './ITemplate';
import Template from './Template';

let duplicateTemplateNameOrder = 0;

export default class TemplateTable implements ITemplateTable {
    public static getInstance(templatesPath: string): ITemplateTable {
        if (!this._instance) {
            this._instance = new TemplateTable(templatesPath);

        }
        return this._instance;
    }

    public static freeInstance() {
        this._instance = null;
    }

    public async init() {
        try {
            const templatesPath = this._templatesPath;
            const templateDirs = readdirSync(templatesPath)
                .map((dir: string) => normalize(resolve(templatesPath, dir)))
                .filter((dir: string) => isDirectory(dir));

            await Promise.all(
                templateDirs.map(async (templateDir: string) => {
                    const template = await Template.createTemplate(templateDir);
                    if (template) {
                        this.addTemplate(template);
                    }
                })
            );
        } catch (e) {
            TemplateTable.freeInstance();
            throw e;
        }
    }

    public getTemplateNames(): string[] {
        return Array.from(this._nameIdTable.keys());
    }

    public getTemplates(): ITemplate[] {
        return Array.from(this._idTemplateTable.values());
    }

    public getTemplateByName(name: string): ITemplate | undefined {
        return this.getTemplateById(this._nameIdTable.get(name) || '');
    }

    public getTemplateById(id: string): ITemplate | undefined {
        return this._idTemplateTable.get(id);
    }

    public addTemplate(template: ITemplate): void {
        const templateId = this._nameIdTable.get(template.name);
        if (templateId && templateId !== template.id) {
            template.name = `${template.name}.${++duplicateTemplateNameOrder}`;
        }

        this._idTemplateTable.set(template.id, template);
        this._nameIdTable.set(template.name, template.id);
    }

    public deleteTemplate(templateId: string): void {
        const template = this.getTemplateById(templateId);
        if (template) {
            this._nameIdTable.delete(template.name);
            this._idTemplateTable.delete(template.id);
        }
    }

    private constructor(templatesPath: string) {
        this._templatesPath = templatesPath;
    }

    private static _instance: TemplateTable | null = null;
    private _idTemplateTable = new Map<string, ITemplate>();
    private _nameIdTable = new Map<string, string>();
    private _templatesPath: string;
}
