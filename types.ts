export type Restaurant = {
  id: string;
  placeId: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  address: string;
  priceLevel: string;
  formattedPriceLevel: string;
  isOpenNow?: boolean;
  openingHours?: string[];
  photoReference?: string;
}; 