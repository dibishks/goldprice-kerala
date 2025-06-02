import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
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
  styleUrls: ['./home.scss'],
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
  isLoading = {
    currentPrice: false,
    priceHistory: false,
    dailyPrices: false,
  };

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  chartOptions = {
    view: [null, 400] as [number | null, number],
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
      domain: ['#2196f3', '#f44336', '#4caf50'], // Blue, Red, Green
    },
  };

  constructor(private goldPriceService: GoldPriceService) {}

  ngAfterViewInit() {
    this.updateChartWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChartWidth();
    // Update bar padding on resize
    if (window.innerWidth < 480) {
      this.chartOptions.barPadding = 2; // Even smaller padding for very small screens
    } else if (window.innerWidth < 768) {
      this.chartOptions.barPadding = 8; // Smaller padding for tablets and larger phones
    } else {
      this.chartOptions.barPadding = 16; // Default padding for larger screens
    }
    // Update chart data on resize to adjust the number of bars
    this.updateChartData();
  }

  updateChartWidth() {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      let containerWidth = this.chartContainer.nativeElement.offsetWidth;
      // For mobile, reduce bar width to fit all 7 bars comfortably
      if (window.innerWidth < 480) {
        // Reduce per-bar width to 38px for 7 bars = 266px, add some padding
        containerWidth = Math.max(containerWidth, 280); // 38*7 + padding
        this.chartOptions.barPadding = 2; // Reduce bar padding for mobile
      }
      this.chartWidth = containerWidth;
      this.chartOptions.view = [containerWidth, 400];
    }
  }

  updateChartData() {
    // Always display 7 days of history
    const daysToDisplay = 7;

    // Slice the monthly history to get the data for the chart
    const historyToDisplay = this.monthlyHistory.slice(-daysToDisplay);

    // Find min and max prices for 8 gram in the displayed history
    const prices = historyToDisplay
      .map((item) => item.priceEightGram)
      .filter((price) => price !== undefined);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Create bar chart data with custom colors for 8 gram
    const series = historyToDisplay.map((item) => {
      const date = item.date instanceof Date ? item.date : new Date(item.date);
      return {
        name: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        value: item.priceEightGram ?? 0,
      };
    });

    this.chartData = [
      {
        name: '22K Gold (8g)',
        series: series,
      },
    ];

    // Set custom colors for 8 gram based on min/max prices in the displayed history
    this.customColors = historyToDisplay.map((item) => {
      const date = item.date instanceof Date ? item.date : new Date(item.date);
      return {
        name: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        value:
          item.priceEightGram === maxPrice
            ? '#f44336'
            : item.priceEightGram === minPrice
            ? '#4caf50'
            : '#2196f3',
      };
    });
  }

  ngOnInit() {
    // Call updateChartWidth initially to set correct size
    this.updateChartWidth();

    // Set initial bar padding based on screen size
    if (window.innerWidth < 480) {
      this.chartOptions.barPadding = 4;
    } else if (window.innerWidth < 768) {
      this.chartOptions.barPadding = 8;
    } else {
      this.chartOptions.barPadding = 16;
    }

    // Get current price
    this.isLoading.currentPrice = true;
    this.goldPriceService.getCurrentPrices().subscribe({
      next: (price) => {
        this.currentPrice = price;
        this.currentGoldPrice = price;
        this.isLoading.currentPrice = false;
      },
      error: () => {
        this.isLoading.currentPrice = false;
      },
    });

    // Get price history for chart
    this.isLoading.priceHistory = true;
    this.goldPriceService.getPriceHistory().subscribe({
      next: (history) => {
        // Reverse the history so earliest date is first
        this.monthlyHistory = [...history].reverse(); // Store full history
        this.updateChartData(); // Update chart data after getting history
        this.isLoading.priceHistory = false;
      },
      error: () => {
        this.isLoading.priceHistory = false;
      },
    });

    // Get daily prices for table
    this.isLoading.dailyPrices = true;
    this.goldPriceService.getDailyPrices().subscribe({
      next: (prices) => {
        this.dailyPrices = prices;
        this.isLoading.dailyPrices = false;
      },
      error: () => {
        this.isLoading.dailyPrices = false;
      },
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
          this.tooltipContent = `${data.date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          })}: ₹${(data.priceEightGram ?? 0).toLocaleString('en-IN')}`;
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
