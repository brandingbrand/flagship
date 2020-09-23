export const baseName = (path: string) => {
  const basePath = path.substring(path.lastIndexOf('/') + 1);
  if (basePath.lastIndexOf('.') !== -1) {
    return basePath.substring(0, basePath.lastIndexOf('.'));
  }
  return basePath;
};
