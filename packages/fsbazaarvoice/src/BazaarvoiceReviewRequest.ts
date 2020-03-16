export interface BazaarvoiceReviewRequest {
  Filter: string | string[];
  Sort?: string;
  Include: 'Products';
  Stats: 'Reviews';
  Limit: number;
  Offset?: number;
}
