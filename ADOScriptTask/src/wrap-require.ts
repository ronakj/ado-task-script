import * as path from 'path'

export const wrapRequire = new Proxy(require, {
  apply: (target, thisArg, [moduleID]) => {
    if (moduleID.startsWith('.')) {
      moduleID = path.resolve(moduleID)
      return target.apply(thisArg, [moduleID])
    }

    const modulePath = target.resolve.apply(thisArg, [
      moduleID,
      {
        paths: [process.cwd()]
      }
    ]);

    return target.apply(thisArg, [modulePath])
  },

  get: (target, prop, receiver) => {
    Reflect.get(target, prop, receiver)
  }
})