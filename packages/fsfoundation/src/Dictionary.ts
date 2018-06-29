/**
 *  An open string to value map. Generally you should use a more specific type instead of this.
 */
export interface Dictionary<T = any> {
  [key: string]: T;
  [key: number]: T;
}
