export interface CmsRetinaImage {
  path?: string;
  width?: number;
  height?: number;
}

export interface CmsCategoryItem {
  Identifier: string;
  Title: string;
  Description?: string;
  DataSourceType?: string;
  'Retina-Image': CmsRetinaImage;
}

export interface ContentForSlotData {
  instances?: CmsCategoryItem[];
}
