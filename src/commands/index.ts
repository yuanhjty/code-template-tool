import editTemplates from './editTemplates';
import newFromTemplate from './newFromTemplate';

interface CommandTable {
    [propName: string]: (...args: any[]) => void | Promise<void>;
}

const commandTable: CommandTable = {
    'extension.newFromTemplate': newFromTemplate,
    'extension.editTemplates': editTemplates,
};

export default commandTable;
