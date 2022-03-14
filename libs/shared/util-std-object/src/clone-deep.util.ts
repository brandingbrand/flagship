export const cloneDeep = <T>(object: T): T => JSON.parse(JSON.stringify(object));
