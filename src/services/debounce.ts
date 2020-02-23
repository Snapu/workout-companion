export function Debounce(timeout: number) {
  let timer!: number;

  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function(...args: any) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => original.apply(this, args), timeout);
    };

    return descriptor;
  };
}
