import { IIdentifierStyleDTO } from '../model/types';
import {
  words,
  isUpperCase,
  isLowerCase,
  isTitleCase,
  trim,
  toTitleCase,
  toUpperCase as stringToUpperCase,
  toLowerCase as stringToLowerCase,
  toLowerCaseIfNotUpperCase,
  toTitleCaseIfNotUpperCase,
} from './string';
import { pipe, flipCurry } from './function';

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
function convertCase(value: string, sep: TSep, wordConverter: TMapCbl): string {
  return words(value)
    .map(wordConverter)
    .join(sep);
}

function getToLowerCaseConverter(keepUpperCase?: boolean): typeof stringToLowerCase {
  return keepUpperCase ? toLowerCaseIfNotUpperCase : stringToLowerCase;
}

function getToTitleCaseConverter(keepUpperCase?: boolean): typeof toTitleCase {
  return keepUpperCase ? toTitleCaseIfNotUpperCase : toTitleCase;
}

export function toLowerCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, emptySep, getToLowerCaseConverter(keepUpperCase));
}

export function toUpperCase(value: string): string {
  return convertCase(value, emptySep, stringToUpperCase);
}

export function toPascalCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, emptySep, getToTitleCaseConverter(keepUpperCase));
}

function getToCamelCaseMapCbl(keepUpperCase?: boolean) {
  return function cbl(value: string, index: number): string {
    const fistWordConverter = getToLowerCaseConverter(keepUpperCase);
    const restWordsConverter = getToTitleCaseConverter(keepUpperCase);
    const converter = index === 0 ? fistWordConverter : restWordsConverter;
    return converter(value);
  };
}

export function toCamelCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, emptySep, getToCamelCaseMapCbl(keepUpperCase));
}

export function toSnakeCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, snakeSep, getToLowerCaseConverter(keepUpperCase));
}

export function toKebabCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, kebabSep, getToLowerCaseConverter(keepUpperCase));
}

export function toSnakeUpperCase(value: string): string {
  return convertCase(value, snakeSep, stringToUpperCase);
}

export function toSnakePascalCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, snakeSep, getToTitleCaseConverter(keepUpperCase));
}

export function toKebabUpperCase(value: string): string {
  return convertCase(value, kebabSep, stringToUpperCase);
}

export function toKebabPascalCase(value: string, keepUpperCase?: boolean): string {
  return convertCase(value, kebabSep, getToTitleCaseConverter(keepUpperCase));
}
// ---- Identifier converters

export function normalizeCase(caseStr: string): string {
  return pipe(
    flipCurry(toPascalCase)(false),
    stringToUpperCase
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
    wordList.slice(1).every((word: string) => isTitleCase(word) || isUpperCase(word))
  );
}

function isPascalCaseList(wordList: string[]): boolean {
  return (
    !isUpperCaseList(wordList) &&
    wordList.every((word: string) => isTitleCase(word) || isUpperCase(word))
  );
}

/**
 * If identifier containers any characters that are not in the character set { a-z, A-Z, -, _ },
 * UNKNOWN will be returned.
 */
export function checkIdentifierCase(identifier: string): string {
  if (/[^a-zA-Z\-_]/.test(identifier)) {
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
const identifierConverterTable: { [propName: string]: Function } = {
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

export function convertIdentifierCase(
  identifier: string,
  identifierCase: string,
  keepUpperCase?: boolean
): string {
  return identifierConverterTable[identifierCase](identifier, keepUpperCase);
}

export function convertIdentifierStyle(
  identifier: string,
  style: IIdentifierStyleDTO,
  placeholder: string
): string {
  if (style.noTransformation) {
    return identifier;
  }

  let identifierCase = normalizeCase(style.case);
  if (identifierCase === AUTO) {
    identifierCase = checkIdentifierCase(placeholder);
  }
  const { keepUpperCase, prefix, suffix } = style;
  const convertedIdentifier = convertIdentifierCase(identifier, identifierCase, keepUpperCase);
  return `${prefix}${convertedIdentifier}${suffix}`;
}
// ---- Identifier case and style converter
