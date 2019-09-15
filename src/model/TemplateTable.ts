import { readdirSync } from 'fs';
import { normalize, resolve } from 'path';
import { isDirectory } from '../utils/fs';
import { ITemplate, ITemplateTable } from './types';
import Template from './Template';

let duplicateTemplateNameOrder = 0;

export default class TemplateTable implements ITemplateTable {
  public static getInstance(templatesPath: string): ITemplateTable {
    if (!this._instance) {
      this._instance = new TemplateTable(templatesPath);
    }
    return this._instance;
  }

  public static freeInstance(): void {
    this._instance = null;
  }

  public async init(): Promise<void> {
    try {
      const templatesPath = this._templatesPath;
      const templateDirs = readdirSync(templatesPath)
        .map((dir: string) => normalize(resolve(templatesPath, dir)))
        .filter((dir: string) => isDirectory(dir));

      await Promise.all(
        templateDirs.map(async (templateDir: string) => {
          const template = await Template.createTemplate(templateDir);
          if (template) {
            this.add(template);
          }
        })
      );
    } catch (e) {
      TemplateTable.freeInstance();
      throw e;
    }
  }

  public getById(templateId: string): ITemplate | undefined {
    return this._idTemplateTable.get(templateId);
  }

  public getByName(templateName: string): ITemplate | undefined {
    return this.getById(this._nameIdTable.get(templateName) || '');
  }

  /**
   * Add a template into the template table.
   * If the template table already has the same template, cover it with the new one.
   */
  public add(template: ITemplate): void {
    const existingTemplateId = this._nameIdTable.get(template.name);
    if (existingTemplateId && existingTemplateId !== template.id) {
      // If encountering duplicate template names when add a template into the template table,
      // rename the new one by adding a number suffix to the duplicate name.
      template.name = `${template.name}.${duplicateTemplateNameOrder += 1}`;
    }

    this._idTemplateTable.set(template.id, template);
    this._nameIdTable.set(template.name, template.id);
  }

  public deleteById(templateId: string): void {
    const templateToDelete = this.getById(templateId);
    this.delete(templateToDelete);
  }

  public deleteByName(templateName: string): void {
    const templateToDelete = this.getByName(templateName);
    this.delete(templateToDelete);
  }

  public entries(): ITemplate[] {
    return Array.from(this._idTemplateTable.values());
  }

  public size(): number {
    return this._idTemplateTable.size;
  }

  private constructor(templatesPath: string) {
    this._templatesPath = templatesPath;
  }

  private delete(template: ITemplate | undefined): void {
    if (template) {
      this._nameIdTable.delete(template.name);
      this._idTemplateTable.delete(template.id);
    }
  }

  private static _instance: TemplateTable | null = null;
  private _idTemplateTable = new Map<string, ITemplate>();
  private _nameIdTable = new Map<string, string>();
  private _templatesPath: string;
}
