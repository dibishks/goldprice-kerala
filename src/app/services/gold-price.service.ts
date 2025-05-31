import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoldPrice, GoldPriceApiResponse } from '../interfaces/gold-price.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoldPriceService {
  private headers = new HttpHeaders({
    'promise': 'z1eDDPTpIU4g4GBXm6ZWRfMKDoUGPYnoLIx'
  });

  constructor(private http: HttpClient) { }

  // Get current prices
  getCurrentPrices(): Observable<GoldPrice> {
    return this.http.get<GoldPriceApiResponse>(`${environment.apiUrl}/list-price`, { headers: this.headers })
      .pipe(
        map(response => response.data.currentGoldPrice)
      );
  }

  // Get price history for bar chart
  getPriceHistory(): Observable<GoldPrice[]> {
    return this.http.get<GoldPriceApiResponse>(`${environment.apiUrl}/list-price`, { headers: this.headers })
      .pipe(
        map(response => {
          return response.data.goldPriceBarChart.map(price => ({
            ...price,
            date: new Date(price.date),
            formattedDate: this.formatDate(new Date(price.date))
          }));
        })
      );
  }

  // Get daily prices
  getDailyPrices(): Observable<GoldPrice[]> {
    return this.http.get<GoldPriceApiResponse>(`${environment.apiUrl}/list-price`, { headers: this.headers })
      .pipe(
        map(response => response.data.dailyPrice)
      );
  }

  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
} 