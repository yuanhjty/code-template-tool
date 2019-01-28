import {
    words,
    isUpperCase,
    isLowerCase,
    isCapital,
    trim,
    lowerIfNotUpperCase,
    capitalizeIfNotUpperCase,
    upper,
} from './string';
import { pipe, flipCurry, TPipeFunction } from './function';
import { IIdentifierStyleDTO } from '../model/types';

// Identifier case enums ----
export const LOWER_CASE = 'LOWERCASE';
export const UPPER_CASE = 'UPPERCASE';
export const CAMEL_CASE = 'CAMELCASE';
export const PASCAL_CASE = 'PASCALCASE';
export const SNAKE_CASE = 'SNAKECASE';
export const KEBAB_CASE = 'KEBABCASE';

export const SNAKE_UPPER_CASE = 'SNAKEUPPERCASE';
export const SNAKE_PASCAL_CASE = 'SNAKEPASCALCASE';
export const UPPER_SNAKE_CASE = 'UPPERSNAKECASE'; // Alias for SNAKE_UPPER_CASE
export const PASCAL_SNAKE_CASE = 'PASCALSNAKECASE'; // Alias for SNAKE_PASCAL_CASE

export const KEBAB_UPPER_CASE = 'KEBABUPPERCASE';
export const KEBAB_PASCAL_CASE = 'KEBABPASCALCASE';
export const UPPER_KEBAB_CASE = 'UPPERKEBABCASE'; // Alias for KEBAB_UPPER_CASE
export const PASCAL_KEBAB_CASE = 'PASCALKEBABCASE'; // Alias for KEBAB_PASCAL_CASE
export const HYPHEN_CASE = 'HYPHENCASE'; // Alias for KEBAB_CASE

export const AUTO = 'AUTO';
export const UNKNOWN = 'UNKNOWN';
// ---- Identifier case enums

type TSep = '_' | '-' | '';
type TMapCbl = ((value: string, index: number) => string) | ((value: string) => string);

const snakeSep = '_';
const kebabSep = '-';
const emptySep = '';

// Identifier converters ----
function convertCase(str: string, sep: TSep, wordConverter: TMapCbl): string {
    return words(str).map(wordConverter).join(sep);
}

export function toLowerCase(str: string): string {
    return convertCase(str, emptySep, lowerIfNotUpperCase);
}

export function toUpperCase(str: string): string {
    return convertCase(str, emptySep, upper);
}

export function toPascalCase(str: string): string {
    return convertCase(str, emptySep, capitalizeIfNotUpperCase);
}

export function toCamelCase(str: string): string {
    return convertCase(str, emptySep, (word: string, index: number) =>
        index === 0 ? lowerIfNotUpperCase(word) : capitalizeIfNotUpperCase(word)
    );
}

export function toSnakeCase(str: string): string {
    return convertCase(str, snakeSep, lowerIfNotUpperCase);
}

export function toKebabCase(str: string): string {
    return convertCase(str, kebabSep, lowerIfNotUpperCase);
}

export function toSnakeUpperCase(str: string): string {
    return convertCase(str, snakeSep, upper);
}

export function toSnakePascalCase(str: string): string {
    return convertCase(str, snakeSep, capitalizeIfNotUpperCase);
}

export function toKebabUpperCase(str: string): string {
    return convertCase(str, kebabSep, upper);
}

export function toKebabPascalCase(str: string): string {
    return convertCase(str, kebabSep, capitalizeIfNotUpperCase);
}
// ---- Identifier converters

export function normalizeCase(caseStr: string) {
    return pipe(
        toPascalCase,
        upper
    )(caseStr);
}

// Identifier case checker ----
function isUpperCaseList(wordList: string[]): boolean {
    return wordList.every((word: string) => isUpperCase(word));
}

function isLowerCaseList(wordList: string[]): boolean {
    return wordList.every((word: string) => isLowerCase(word));
}

function isCamelCaseList(wordList: string[]): boolean {
    return (
        isLowerCase(wordList[0]) &&
        wordList.slice(1).every((word: string) => isCapital(word) || isUpperCase(word))
    );
}

function isPascalCaseList(wordList: string[]): boolean {
    return (
        !isUpperCaseList(wordList) &&
        wordList.every((word: string) => isCapital(word) || isUpperCase(word))
    );
}

/**
 * If identifier containers any characters that are not in the character set { a-z, A-Z, -, _ },
 * UNKNOWN will be returned.
 */
export function checkIdentifierCase(identifier: string): string {
    if (/[^a-zA-Z_\-]/.test(identifier)) {
        return UNKNOWN;
    }

    const trimmedIdentifier = pipe<string>(
        flipCurry(trim)(snakeSep),
        flipCurry(trim)(kebabSep)
    )(identifier);
    const wordList = words(trimmedIdentifier);

    const isSnakeJoined = trimmedIdentifier.includes(snakeSep);
    const isKebabJoined = trimmedIdentifier.includes(kebabSep);

    if (isSnakeJoined && isKebabJoined) {
        return UNKNOWN;
    }

    switch (true) {
        case isCamelCaseList(wordList):
            if (isSnakeJoined || isKebabJoined) {
                return UNKNOWN;
            }
            if (wordList.length === 1) {
                return LOWER_CASE;
            }
            return CAMEL_CASE;
        case isLowerCaseList(wordList):
            if (isSnakeJoined) {
                return SNAKE_CASE;
            }
            if (isKebabJoined) {
                return KEBAB_CASE;
            }
            return LOWER_CASE;
        case isPascalCaseList(wordList):
            if (isSnakeJoined) {
                return SNAKE_PASCAL_CASE;
            }
            if (isKebabJoined) {
                return KEBAB_PASCAL_CASE;
            }
            return PASCAL_CASE;
        case isUpperCaseList(wordList):
            if (isSnakeJoined) {
                return SNAKE_UPPER_CASE;
            }
            if (isKebabJoined) {
                return KEBAB_UPPER_CASE;
            }
            return UPPER_CASE;
        default:
            return UNKNOWN;
    }
}
// ---- Identifier case checker

// Identifier case and style converter ----
const identifierConverterTable: { [propName: string]: TPipeFunction<string> } = {
    [LOWER_CASE]: toLowerCase,
    [UPPER_CASE]: toUpperCase,
    [CAMEL_CASE]: toCamelCase,
    [PASCAL_CASE]: toPascalCase,
    [SNAKE_CASE]: toSnakeCase,
    [KEBAB_CASE]: toKebabCase,
    [HYPHEN_CASE]: toKebabCase,

    [SNAKE_UPPER_CASE]: toSnakeUpperCase,
    [UPPER_SNAKE_CASE]: toSnakeUpperCase,
    [SNAKE_PASCAL_CASE]: toSnakePascalCase,
    [PASCAL_SNAKE_CASE]: toSnakePascalCase,

    [KEBAB_UPPER_CASE]: toKebabUpperCase,
    [UPPER_KEBAB_CASE]: toKebabUpperCase,
    [KEBAB_PASCAL_CASE]: toKebabPascalCase,
    [PASCAL_KEBAB_CASE]: toKebabPascalCase,
    [UNKNOWN]: (arg: string) => arg,
};

export function convertIdentifierCase(identifier: string, identifierCase: string): string {
    return identifierConverterTable[identifierCase](identifier);
}

export function convertIdentifierStyle(
    identifier: string,
    style: IIdentifierStyleDTO,
    placeholder: string
): string {
    if (style.rawInput) {
        return identifier;
    }

    let identifierCase = normalizeCase(style.case);
    if (identifierCase === AUTO) {
        identifierCase = checkIdentifierCase(placeholder);
    }
    const { prefix, suffix } = style;
    const convertedIdentifier = convertIdentifierCase(identifier, identifierCase);
    return `${prefix}${convertedIdentifier}${suffix}`;
}
// ---- Identifier case and style converter
