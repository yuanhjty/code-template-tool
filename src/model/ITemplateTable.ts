import ITemplate from "./ITemplate";

export default interface ITemplateTable {
    init(): Promise<void>;
    getTemplateNames(): string[];
    getTemplates(): ITemplate[];
    getTemplateByName(templateName: string): ITemplate | undefined;
    getTemplateById(templateId: string): ITemplate | undefined;
    addTemplate(template: ITemplate): void;
    deleteTemplate(templateId: string): void;
}
