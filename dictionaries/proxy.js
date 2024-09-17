export function createProxy(obj, path = '') {
    return new Proxy(obj, {
      get(target, prop) {
        // Construct the new path
        const newPath = path ? `${path}.${prop}` : prop;

        // If the property exists and is an object, create a new proxy for it
        if (prop in target) {
          if (typeof target[prop] === 'object' && target[prop] !== null) {
            return createProxy(target[prop], newPath);
          }
          return target[prop]; // Return the property if it's a value
        } else {
          // If the property doesn't exist, return the constructed path
          return newPath;
        }
      }
    });
  }