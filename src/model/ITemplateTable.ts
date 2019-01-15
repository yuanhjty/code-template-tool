import ITemplate from "./ITemplate";

export default interface ITemplateTable {
    getTemplateNames(): string[];
    getTemplates(): ITemplate[];
    getTemplate(templateName: string): ITemplate | undefined;
}
