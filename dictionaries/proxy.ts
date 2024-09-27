interface Dictionary {
  [key: string]: string | Dictionary;
}

export function createProxy(dictionary: Dictionary) {
  return new Proxy(dictionary, {
    get(target, prop) {
      const recursive_prop =
        typeof prop === "string" ? prop.split(".") : [prop];
      let value: any = target;
      for (let i = 0; i < recursive_prop.length; i++) {
        try {
          value = value[recursive_prop[i]];
        } catch (e) {
          return prop;
        }
      }
      if (typeof value === "object" || value === undefined) {
        return prop;
      }
      return value;
    },
  });
}
