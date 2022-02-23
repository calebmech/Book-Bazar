export type ResponseObject<T> = {
  [k in keyof T]: T[k] extends Date ? string : T[k];
};

export function createResponseObject<T>(object: T): ResponseObject<T> {
  return JSON.parse(JSON.stringify(object));
}
