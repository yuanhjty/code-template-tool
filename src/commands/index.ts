import editTemplates from './editTemplates';
import newFromTemplate from './newFromTemplate';

interface Commands {
    [propName: string]: (...args: any[]) => void | Promise<void>;
}

const commands: Commands = {
    'extension.newFromTemplate': newFromTemplate,
    'extension.editTemplates': editTemplates,
};

export default commands;
