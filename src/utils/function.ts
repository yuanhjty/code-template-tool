export type TPipeFunction<T> = (arg: T) => T;

export function pipe<T>(...fns: TPipeFunction<T>[]) {
  return (arg: T): T => fns.reduce((param: T, f) => f(param), arg);
}

export function compose<T>(...fns: TPipeFunction<T>[]) {
  return (arg: T): T => fns.reduceRight((param: T, f) => f(param), arg);
}

// export const curry = (fn: Function) => (arg: any) =>
//     fn.length === 1 ? fn(arg) : curry(fn.bind(null, arg));

export const curry = (fn: Function, ...args: any[]) => (arg: any): any =>
  args.length === fn.length - 1 ? fn(...args, arg) : curry(fn, ...args, arg);

export const flipCurry = (fn: Function, ...args: any[]) => (arg: any): any =>
  args.length === fn.length - 1 ? fn(arg, ...args.reverse()) : flipCurry(fn, ...args, arg);
