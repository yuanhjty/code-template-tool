import { words, lowerFirst, capitalize, isUpperCase, isLowerCase, isCapital, trim } from './string';
import { IIdentifierStyleDTO } from '../model/types';

export const PASCALCASE = 'PASCALCASE';
export const CAMELCASE = 'CAMELCASE';
export const SNAKECASE = 'SNAKECASE';
export const HYPHENCASE = 'HYPHENCASE'; // For Compatibility
export const KEBABCASE = 'KEBABCASE';
export const AUTO = 'AUTO';
export const UNKNOWN = 'UNKNOWN';

function splitAndConvertCase(str: string): string[] {
    return words(str).map(word => (isUpperCase(word) ? word : word.toLowerCase()));
}

export function toPascalCase(str: string): string {
    return splitAndConvertCase(str)
        .map(word => (isUpperCase(word) ? word : capitalize(word)))
        .join('');
}

export function toCamelCase(str: string): string {
    const wordArr = splitAndConvertCase(str).map(word =>
        isUpperCase(word) ? word : capitalize(word)
    );
    if (!isUpperCase(wordArr[0])) {
        wordArr[0] = lowerFirst(wordArr[0]);
    }
    return wordArr.join('');
}

export function toSnakeCase(str: string): string {
    return splitAndConvertCase(str).join('_');
}

export function toKebabCase(str: string): string {
    return splitAndConvertCase(str).join('-');
}

export function checkIdentifierCase(identifier: string): string {
    if (trim(identifier, '_').includes('_')) {
        return SNAKECASE;
    }
    if (trim(identifier, '-').includes('-')) {
        return KEBABCASE;
    }

    const wordsArr = words(identifier);
    if (wordsArr.length === 1 || wordsArr.slice(1).every(w => isUpperCase(w[0]))) {
        if (isLowerCase(wordsArr[0])) {
            return CAMELCASE;
        }
        if (isCapital(wordsArr[0])) {
            return PASCALCASE;
        }
    }

    return UNKNOWN;
}

function convertIdentifierCase(identifier: string, identifierCase: string): string {
    switch (identifierCase) {
        case CAMELCASE:
            return toCamelCase(identifier);
        case PASCALCASE:
            return toPascalCase(identifier);
        case SNAKECASE:
            return toSnakeCase(identifier);
        case HYPHENCASE: // For Compatibility
        case KEBABCASE:
            return toKebabCase(identifier);
        case UNKNOWN:
        default:
            return identifier;
    }
}

export function convertIdentifierStyle(
    identifier: string,
    style: IIdentifierStyleDTO,
    placeholder: string
): string {
    if (style.rawInput) {
        return identifier;
    }

    let identifierCase = style.case.toUpperCase();
    if (identifierCase === AUTO) {
        identifierCase = checkIdentifierCase(placeholder);
    }
    const { prefix, suffix } = style;
    const convertedIdentifier = convertIdentifierCase(identifier, identifierCase);
    return `${prefix}${convertedIdentifier}${suffix}`;
}
