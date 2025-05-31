import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  currentPrice: GoldPrice | null = null;
  currentGoldPrice: any = null;
  monthlyHistory: GoldPrice[] = [];
  dailyPrices: GoldPrice[] = [];
  chartData: any[] = [];
  customColors: any[] = [];
  chartWidth = 1100;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  chartOptions = {
    view: [1100, 400] as [number, number],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    xAxisLabel: 'Date',
    showYAxisLabel: true,
    yAxisLabel: 'Price (₹)',
    barPadding: window.innerWidth < 768 ? 2 : 16,
    roundEdges: true,
    showGridLines: true,
    colorScheme: {
      name: 'custom',
      selectable: false,
      group: ScaleType.Ordinal,
      domain: ['#2196f3', '#f44336', '#4caf50'] // Blue, Red, Green
    }
  };

  constructor(private goldPriceService: GoldPriceService) {}

  ngAfterViewInit() {
    this.updateChartWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChartWidth();
  }

  updateChartWidth() {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      this.chartWidth = this.chartContainer.nativeElement.offsetWidth;
    }
  }

  ngOnInit() {
    // Get current price
    this.goldPriceService.getCurrentPrices().subscribe(price => {
      this.currentPrice = price;
      this.currentGoldPrice = price;
    });

    // Get price history for chart
    this.goldPriceService.getPriceHistory().subscribe(history => {
      // Reverse the history so earliest date is first
      this.monthlyHistory = [...history].reverse();
      
      // Find min and max prices for 8 gram
      const prices = this.monthlyHistory.map(item => item.priceEightGram).filter(price => price !== undefined);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Create bar chart data with custom colors for 8 gram
      const series = this.monthlyHistory.map(item => {
        return {
          name: item.date instanceof Date ? item.date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : item.date,
          value: item.priceEightGram ?? 0,
          extra: { formattedPrice: `₹${(item.priceEightGram ?? 0).toLocaleString('en-IN')}` }
        };
      });

      this.chartData = [{
        name: '22K Gold (8g)',
        series: series
      }];

      // Set custom colors for 8 gram based on min/max prices
      this.customColors = this.monthlyHistory.map(item => ({
        name: item.date instanceof Date ? item.date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : item.date,
        value: item.priceEightGram === maxPrice ? '#f44336' :
               item.priceEightGram === minPrice ? '#4caf50' :
               '#2196f3'
      }));
    });

    // Get daily prices for table
    this.goldPriceService.getDailyPrices().subscribe(prices => {
      this.dailyPrices = prices;
    });
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }

  formatTooltipText(data: { name: string, value: number, series: string }): string {
    return `${data.name}: ₹${data.value}`;
  }

  // Format the value for the tooltip
  formatPrice(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
