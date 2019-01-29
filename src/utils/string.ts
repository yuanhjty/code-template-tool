export function isUpperCase(str: string): boolean {
    return /^[A-Z\d]+$/.test(str);
}

export function isLowerCase(str: string): boolean {
    return /^[a-z\d]+$/.test(str);
}

export function isTitleCase(str: string): boolean {
    return isUpperCase(str[0]) && isLowerCase(str.slice(1));
}

export function toUpperCase(str: string): string {
    return str.toUpperCase();
}

export function toLowerCase(str: string): string {
    return str.toLowerCase();
}

export function toTitleCase(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}

export function toLowerCaseIfNotUpperCase(str: string): string {
    return isUpperCase(str) ? str : str.toLowerCase();
}

export function toTitleCaseIfNotUpperCase(str: string): string {
    return isUpperCase(str) ? str : toTitleCase(str);
}

export function duplicate(str: string, n: number) {
    let strArr = [];
    for (let i = 0; i < n; i += 1) {
        strArr.push(str);
    }
    return strArr.join('');
}

export function trim(str: string, toTrim: string): string {
    const step = toTrim.length;
    let prefixEndIndex = 0;
    let suffixStartIndex = 0;

    for (let i = 0; i < str.length; i += step) {
        const s = str.slice(i, i + step);
        if (s !== toTrim) {
            prefixEndIndex = i;
            break;
        }
    }

    for (let i = str.length; i > 0; i -= step) {
        const s = str.slice(i - step, i);
        if (s !== toTrim) {
            suffixStartIndex = i;
            break;
        }
    }

    return str.slice(prefixEndIndex, suffixStartIndex);
}

const wordPattern = /[a-z\d]+|[A-Z]\d*[a-z][a-z\d]*|[A-Z][A-Z\d]*(?=[A-Z]\d*[a-z][a-z\d]*|[^a-zA-Z\d]|$)/g;
export function words(str: string): string[] {
    return str.match(wordPattern) || [];
}
