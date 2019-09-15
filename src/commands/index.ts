import newFromTemplate from './newFromTemplate';
import editTemplates from './editTemplates';
import reloadTemplates from './reloadTemplates';

interface CommandTable {
  [propName: string]: (...args: any[]) => void | Promise<void>;
}

const commandTable: CommandTable = {
  'extension.newFromTemplate': newFromTemplate,
  'extension.editTemplates': editTemplates,
  'extension.reloadTemplates': reloadTemplates,
};

export default commandTable;
