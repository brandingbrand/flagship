export interface BazaarvoiceReviewRequest {
  PassKey: string;
  ApiVersion: string;
  Filter: string;
  Include: 'Products';
  Stats: 'Reviews';
  Limit: number;
  Offset?: number;
}
