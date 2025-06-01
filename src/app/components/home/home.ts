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
  showTooltip = false;
  tooltipContent = '';
  tooltipX = 0;
  tooltipY = 0;

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
    barPadding: window.innerWidth < 768 ? 8 : 16,
    roundEdges: true,
    showGridLines: true,
    yScaleMin: 60000,
    animations: true,
    tooltipDisabled: true,
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
    // Update bar padding on resize
    this.chartOptions.barPadding = window.innerWidth < 768 ? 8 : 16;
  }

  updateChartWidth() {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      const containerWidth = this.chartContainer.nativeElement.offsetWidth;
      this.chartWidth = Math.max(containerWidth, 300); // Ensure minimum width of 300px
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
      // Reverse the history so earliest date is first and take only last 7 days
      this.monthlyHistory = [...history].reverse().slice(-7);
      
      // Find min and max prices for 8 gram
      const prices = this.monthlyHistory.map(item => item.priceEightGram).filter(price => price !== undefined);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Create bar chart data with custom colors for 8 gram
      const series = this.monthlyHistory.map(item => {
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          name: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
          value: item.priceEightGram ?? 0
        };
      });

      this.chartData = [{
        name: '22K Gold (8g)',
        series: series
      }];

      // Set custom colors for 8 gram based on min/max prices
      this.customColors = this.monthlyHistory.map(item => {
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          name: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
          value: item.priceEightGram === maxPrice ? '#f44336' :
                 item.priceEightGram === minPrice ? '#4caf50' :
                 '#2196f3'
        };
      });
    });

    // Get daily prices for table
    this.goldPriceService.getDailyPrices().subscribe(prices => {
      this.dailyPrices = prices;
    });
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      const rect = this.chartContainer.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Only show tooltip if mouse is within the chart container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // Find the closest bar
        const barWidth = this.chartWidth / this.monthlyHistory.length;
        const barIndex = Math.floor(x / barWidth);
        
        if (barIndex >= 0 && barIndex < this.monthlyHistory.length) {
          const data = this.monthlyHistory[barIndex];
          this.showTooltip = true;
          this.tooltipContent = `${data.date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}: ₹${(data.priceEightGram ?? 0).toLocaleString('en-IN')}`;
          this.tooltipX = event.clientX;
          this.tooltipY = event.clientY;
        } else {
          this.showTooltip = false;
        }
      } else {
        this.showTooltip = false;
      }
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      const rect = this.chartContainer.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Only hide tooltip if mouse leaves the chart container
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        this.showTooltip = false;
      }
    }
  }
}
