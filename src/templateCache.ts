import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readdir, mkdir } from './utils/fsAsyncApi';
import { templatesPath } from './utils/configInfo';
import { NoTemplateError } from './utils/error';
import Template from './template';

interface TemplatesTable {
    [propName: string]: Template | null;
}

class TemplateCache {
    private templates: TemplatesTable = {};

    public addTemplate(template: Template) {
        this.templates[template.name] = template;
    }

    public getTemplate(name: string): Template | null {
        return this.templates[name];
    }

    public getTemplateNameList(): string[] {
        return Object.keys(this.templates);
    }

    public removeTemplate(name: string) {
        this.templates[name] = null;
    }

    public clear() {
        this.templates = {};
    }

    public async cacheTemplates() {
        try {
            if (!fs.existsSync(templatesPath)) {
                await mkdir(templatesPath);
            }

            const fileNames = await readdir(templatesPath);
            const validFileNames = fileNames.filter((name: string) => name[0] !== '.');

            for (const fileName of validFileNames) {
                const filePath = path.resolve(templatesPath, fileName);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    const template = new Template(filePath);
                    await template.init();
                    this.addTemplate(template);
                }
            }
        } catch (err) {
            throw err;
        }
    }

    public async refreshCache() {
        this.clear();
        await this.cacheTemplates();
    }
}

const templateCache = new TemplateCache();

export async function initTemplatesCache() {
    await templateCache.cacheTemplates();
}

export async function refreshTemplatesCache() {
    await templateCache.refreshCache();
}

export async function selectTemplateFromCache(): Promise<Template | null> {
    try {
        const templateList = templateCache.getTemplateNameList();
        if (templateList.length === 0) {
            throw new NoTemplateError;
        }

        const templateName = await vscode.window.showQuickPick(templateList, {
            placeHolder: 'Select template',
        });

        const template = (templateName && templateCache.getTemplate(templateName)) || null;

        return new Promise<Template | null>(resolve => {
            resolve(template);
        });
    } catch (err) {
        throw err;
    }
}
