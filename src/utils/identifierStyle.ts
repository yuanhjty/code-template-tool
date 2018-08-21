import { words, lowerFirst, capitalize, isUpperCase, isLowerCase, isCapital } from './string';
import { compose } from './function';

export const PASCALCASE = 'PASCALCASE';
export const CAMELCASE = 'CAMELCASE';
export const SNAKECASE = 'SNAKECASE';
export const HYPHENCASE = 'HYPHENCASE';
export const AUTO = 'AUTO';
export const UNKNOWN = 'UNKNOWN';

export function toPascalCase(str: string): string {
    return words(str)
        .map(word => capitalize(word))
        .join('');
}

export function toCamelCase(str: string): string {
    return compose(
        lowerFirst,
        toPascalCase
    )(str);
}

function splitAndConvert(str: string): string[] {
    const wordsArr = words(str);
    return wordsArr.every(word => isUpperCase(word))
        ? wordsArr.map(word => word.toUpperCase())
        : wordsArr.map(word => word.toLowerCase());
}

export function toSnakeCase(str: string): string {
    return splitAndConvert(str).join('_');
}

export function toHyphenCase(str: string): string {
    return splitAndConvert(str).join('-');
}

export function checkIdentifierStyle(identifier: string): string {
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

        if (identifier.indexOf('_')) {
            return SNAKECASE;
        }
    }

    return UNKNOWN;
}

export function getIdentifierStyle(identifier: string, identifierStyle: string): string {
    if (identifierStyle.toUpperCase() === AUTO) {
        return checkIdentifierStyle(identifier);
    }
    return identifierStyle.toUpperCase();
}

export function convertCase(
    identifier: string,
    identifierStyle: string,
    template?: string,
): string {
    const style = getIdentifierStyle(template || identifier, identifierStyle);

    switch (style) {
        case CAMELCASE:
            return toCamelCase(identifier);
        case PASCALCASE:
            return toPascalCase(identifier);
        case SNAKECASE:
            return toSnakeCase(identifier);
        case HYPHENCASE:
            return toHyphenCase(identifier);
        default:
            return identifier;
    }
}
