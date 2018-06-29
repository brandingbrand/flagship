export interface PSHTMLViewProps {
  html: string;
  collapseWhiteSpace?: boolean;
  stylesheet?: any;
  renderNode?: (node: any, index: number, siblings: any, parent: any, defaultRenderer: any) => any;
}
