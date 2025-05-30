import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { GoldPriceService } from '../../services/gold-price.service';
import { GoldPrice } from '../../interfaces/gold-price.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentPrice: GoldPrice | null = null;
  monthlyHistory: GoldPrice[] = [];
  dailyPrices: GoldPrice[] = [];
  chartData: any[] = [];
  chartOptions = {
    view: [700, 300] as [number, number],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Date',
    showYAxisLabel: true,
    yAxisLabel: 'Price (₹)',
    colorScheme: {
      name: 'gold',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#FFD700', '#FFA500', '#FF8C00']
    }
  };

  constructor(private goldPriceService: GoldPriceService) {}

  ngOnInit() {
    // Get current price
    this.goldPriceService.getCurrentPrices().subscribe(price => {
      this.currentPrice = price;
    });

    // Get price history for chart
    this.goldPriceService.getPriceHistory().subscribe(history => {
      this.monthlyHistory = history;
      this.chartData = [{
        name: '22K Gold',
        series: history.map(item => ({
          name: item.date.toLocaleDateString(),
          value: item.price22K
        }))
      }];
    });

    // Get daily prices for table
    this.goldPriceService.getDailyPrices().subscribe(prices => {
      this.dailyPrices = prices;
    });
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }
}
