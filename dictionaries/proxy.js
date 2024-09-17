export function createProxy(dictionary) {
  return new Proxy(dictionary, {
    get(target, prop) {
      const recursive_prop = prop.split(".");
      let value = target;
      for (let i = 0; i < recursive_prop.length; i++) {
        value = value[recursive_prop[i]];
      }
      if (typeof value === "object" || !value) {
        return prop;
      }
      return value;
    }
  });
}