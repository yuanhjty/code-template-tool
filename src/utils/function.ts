export function compose(...fns: Function[]): any {
    return fns.reduceRight(
        (prevFn, currFn) => (data: any) => currFn(prevFn(data)),
        (data: any): any => data
    );
}
