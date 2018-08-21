export function isNumber(str: string): boolean {
    return /^\d+$/.test(str);
}

export function isUpperCase(str: string): boolean {
    return /^[A-Z]+$/.test(str) || isNumber(str);
}

export function isLowerCase(str: string, options = { number: false }): boolean {
    return /^[a-z]+$/.test(str) || (options.number && isNumber(str));
}

export function isCapital(str: string): boolean {
    return isUpperCase(str[0]) && isLowerCase(str.slice(1), { number: true });
}

export function upperFirst(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export function lowerFirst(str: string): string {
    return `${str[0].toLowerCase()}${str.slice(1)}`;
}

export function capitalize(str: string): string {
    return upperFirst(str.toLowerCase());
}

const wordReg = /([a-z\d]+)|([A-Z]\d*[a-z][a-z\d]*)|(([A-Z][A-Z\d]*)(?=(([A-Z]\d*[a-z][a-z\d]*)|([^a-zA-Z\d])|$)))/g;
export function words(str: string): string[] {
    return str.match(wordReg) || [];
}
