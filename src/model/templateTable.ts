import * as fs from 'fs';
import * as path from 'path';
import { readFile } from '../utils/fs';
import { isDirectory } from '../utils/path';
import { showErrMsg } from '../utils/message';
import config from '../utils/config';
import ITemplateTable from './ITemplateTable';
import ITemplate from './ITemplate';
import Template from './Template';

export default class TemplateTable implements ITemplateTable {
    public static async getInstance(templatesPath: string): Promise<TemplateTable> {
        if (!this._instance || this._instance._templatesPath !== templatesPath) {
            this._instance = new TemplateTable(templatesPath);
            try {
                await this._instance.init();
            } catch (error) {
                this.unbindInstance();
                throw error;
            }
        }
        return this._instance;
    }

    public static unbindInstance() {
        this._instance = null;
    }

    public getTemplateNames(): string[] {
        return Array.from(this._templateTable.keys());
    }

    public getTemplates(): ITemplate[] {
        return Array.from(this._templateTable.values());
    }

    public getTemplate(name: string): ITemplate | undefined {
        return this._templateTable.get(name);
    }

    private constructor(templatesPath: string) {
        this._templatesPath = templatesPath;
    }

    private async init() {
        const templatesPath = this._templatesPath;
        const templateDirs = fs
            .readdirSync(templatesPath)
            .map((dir: string) => path.resolve(templatesPath, dir))
            .filter((dir: string) => isDirectory(dir));

        await Promise.all(
            templateDirs.map(async (templateDir: string) => {
                const configPath = path.resolve(templateDir, config.configFile);
                if (fs.existsSync(configPath)) {
                    const configData = await readFile(configPath, { encoding: config.encoding });
                    try {
                        const configDTO = JSON.parse(configData);
                        const template = new Template(templateDir, configDTO);
                        this._templateTable.set(template.name, template);
                    } catch (error) {
                        showErrMsg(`${error.message}: ${configPath}`);
                    }
                }
            })
        );
    }

    private static _instance: TemplateTable | null = null;
    private _templateTable = new Map<string, ITemplate>();
    private _templatesPath: string;
}
