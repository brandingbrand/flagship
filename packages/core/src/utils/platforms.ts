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
