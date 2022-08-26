export interface PluginGeneratorSchema {
  name: string;
  importPath: string;
  appExtensionName: string;
  tags?: string;
  directory?: string;
}
