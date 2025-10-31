export function DebouncedFn<T extends (...args: unknown[]) => void>(fn: T, timeout = 500): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
  
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), timeout);
    };
}  