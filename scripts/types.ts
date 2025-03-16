export type Restaurant = {
  id: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  address: string;
  priceLevel: number;
  // Price level: 0 (free) to 4 (very expensive)
  formattedPriceLevel?: string; // Will be displayed as '$' to '$$$$'
}; 