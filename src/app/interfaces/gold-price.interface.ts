export interface LivePrice {
  price22K: number;
  price24K: number;
  lastUpdated: Date;
}

export interface GoldPrice {
  date: Date;
  price22K: number;
  price24K: number;
  change: number;
  expectedTomorrow: number;
}

export interface DailyPrice {
  date: Date;
  todayPrice: number;
  yesterdayPrice: number;
  priceChange: number;
  tomorrowExpectedPrice: number;
} 