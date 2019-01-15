export function isUpperCase(str: string, options = { number: false }): boolean {
    return options.number ? /^[A-Z\d]+$/.test(str) : /^[A-Z]+$/.test(str);
}

export function isLowerCase(str: string, options = { number: false }): boolean {
    return options.number ? /^[a-z\d]+$/.test(str) : /^[a-z]+$/.test(str);
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

const rWord = /[a-z\d]+|[A-Z]\d*[a-z][a-z\d]*|[A-Z][A-Z\d]*(?=[A-Z]\d*[a-z][a-z\d]*|[^a-zA-Z\d]|$)/g;
export function words(str: string): string[] {
    return str.match(rWord) || [];
}
