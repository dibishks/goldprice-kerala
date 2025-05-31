export interface LivePrice {
  price22K: number;
  price24K: number;
  lastUpdated: Date;
}

export interface GoldPrice {
  _id?: string;
  category?: string;
  humanReadableDate?: string;
  type?: string;
  __v?: number;
  changeEightGram?: number;
  changeOneGram?: number;
  createdDate?: string;
  date: Date | string;
  modifiedDate?: string;
  priceEightGram?: number;
  priceOneGram?: number;
  refreshedAt?: string;
  price22K?: number;
  price24K?: number;
  change?: number;
  expectedTomorrow?: number;
  formattedDate?: string;
}

export interface GoldPriceApiResponse {
  status: boolean;
  data: {
    currentGoldPrice: GoldPrice;
    goldPriceBarChart: GoldPrice[];
    dailyPrice: GoldPrice[];
  };
}

export interface DailyPrice {
  date: Date;
  todayPrice: number;
  yesterdayPrice: number;
  priceChange: number;
  tomorrowExpectedPrice: number;
} 