export function State() {
  return function(target: any, propertyName: string) {
    const key = target.constructor.name + "." + propertyName;
    let val = target[propertyName];

    const getter = () => {
      if (val) {
        return val;
      }
      val = localStorage.getItem(key);
      if (val) {
        console.debug(`restored ${key} from localStorage`);
      }
      return val;
    };

    const setter = (next: any) => {
      if (next) {
        val = next;
        localStorage.setItem(key, next);
      }
    };

    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}
