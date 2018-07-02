export interface BazaarvoiceReviewRequest {
  Filter: string;
  Include: 'Products';
  Stats: 'Reviews';
  Limit: number;
  Offset?: number;
}
