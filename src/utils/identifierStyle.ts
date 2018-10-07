import {
    words,
    lowerFirst,
    capitalize,
    isUpperCase,
    isLowerCase,
    isCapital,
    duplicate,
} from './string';
import { VariableStyle } from '../state/variable';

export const PASCALCASE = 'PASCALCASE';
export const CAMELCASE = 'CAMELCASE';
export const SNAKECASE = 'SNAKECASE';
export const HYPHENCASE = 'HYPHENCASE';
export const AUTO = 'AUTO';
export const UNKNOWN = 'UNKNOWN';

function splitAndConvert(str: string): string[] {
    const wordsArr = words(str);
    return wordsArr.map(word => (isUpperCase(word) ? word : word.toLowerCase()));
}

export function toPascalCase(str: string): string {
    return splitAndConvert(str)
        .map(word => isUpperCase(word) ? word : capitalize(word))
        .join('');
}

export function toCamelCase(str: string): string {
    const wordArr = splitAndConvert(str)
        .map(word => isUpperCase(word) ? word : capitalize(word));
    if (!isUpperCase(wordArr[0])) {
        wordArr[0] = lowerFirst(wordArr[0]);
    }
    return wordArr.join('');
}

export function toSnakeCase(str: string): string {
    return splitAndConvert(str).join('_');
}

export function toHyphenCase(str: string): string {
    return splitAndConvert(str).join('-');
}

export function checkIdentifierCase(identifier: string): string {
    const wordArr = words(identifier);

    if (wordArr.length === 1 || wordArr.slice(1).every(w => isCapital(w))) {
        if (isLowerCase(wordArr[0])) {
            return CAMELCASE;
        }

        if (isCapital(wordArr[0])) {
            return PASCALCASE;
        }
    }

    if (wordArr.every(w => isLowerCase(w, { number: true }))) {
        if (identifier.indexOf('-') !== -1) {
            return HYPHENCASE;
        }

        if (identifier.indexOf('_') !== -1) {
            return SNAKECASE;
        }
    }

    return UNKNOWN;
}

export function getIdentifierCase(identifier: string, identifierCase: string): string {
    if (identifierCase.toUpperCase() === AUTO) {
        return checkIdentifierCase(identifier);
    }
    return identifierCase.toUpperCase();
}

export function convertCase(
    identifier: string,
    identifierStyle: VariableStyle,
    template?: string
): string {
    let convertedIdentifier = identifier;

    const identifierCase = getIdentifierCase(template || identifier, identifierStyle.case);
    switch (identifierCase) {
        case CAMELCASE:
            convertedIdentifier = toCamelCase(identifier);
            break;
        case PASCALCASE:
            convertedIdentifier = toPascalCase(identifier);
            break;
        case SNAKECASE:
            convertedIdentifier = toSnakeCase(identifier);
            break;
        case HYPHENCASE:
            convertedIdentifier = toHyphenCase(identifier);
            break;
        default:
            break;
    }

    const { prefixUnderscore, suffixUnderscore } = identifierStyle;
    const prefix = duplicate('_', prefixUnderscore);
    const suffix = duplicate('_', suffixUnderscore);

    return `${prefix}${convertedIdentifier}${suffix}`;
}
