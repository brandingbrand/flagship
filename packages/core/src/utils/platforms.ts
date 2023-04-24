/**
 * Returns an array of strings representing the platforms based on the provided options.
 *
 * @param {string} options - The options provided to get platforms.
 * @returns {Array<string>} An array of strings representing the platforms.
 */
export const get = (
  options: "ios" | "android" | "native"
): Array<"ios" | "android"> => {
  if (options === "ios") {
    return ["ios"];
  }

  if (options === "android") {
    return ["android"];
  }

  if (options === "native") {
    return ["ios", "android"];
  }

  return ["ios", "android"];
};
