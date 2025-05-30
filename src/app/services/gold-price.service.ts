import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GoldPrice } from '../interfaces/gold-price.interface';

@Injectable({
  providedIn: 'root'
})
export class GoldPriceService {
  // Mock data - You can modify these prices
  private mockPrices: GoldPrice[] = [
    {
      date: new Date('2024-03-20'),
      price22K: 6500,
      price24K: 7100,
      change: 50,
      expectedTomorrow: 6550
    },
    {
      date: new Date('2024-03-19'),
      price22K: 6450,
      price24K: 7050,
      change: -30,
      expectedTomorrow: 6500
    },
    {
      date: new Date('2024-03-18'),
      price22K: 6480,
      price24K: 7080,
      change: 20,
      expectedTomorrow: 6450
    }
  ];

  constructor() { }

  // Get current prices
  getCurrentPrices(): Observable<GoldPrice> {
    return of(this.mockPrices[0]);
  }

  // Get price history
  getPriceHistory(): Observable<GoldPrice[]> {
    const history: GoldPrice[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const basePrice = 6500 + Math.floor(Math.random() * 200) - 100;
      return {
        date,
        price22K: basePrice,
        price24K: Math.round(basePrice * 1.1),
        change: Math.floor(Math.random() * 100) - 50,
        expectedTomorrow: basePrice + Math.floor(Math.random() * 50) - 25
      };
    });
    return of(history);
  }

  // Get daily prices
  getDailyPrices(): Observable<GoldPrice[]> {
    return of(this.mockPrices);
  }
} 