import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-live-gold-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-gold-chart.component.html',
  styleUrls: ['./live-gold-chart.component.scss']
})
export class LiveGoldChartComponent implements AfterViewInit, OnInit {
  @ViewChild('tradingviewWidgetContainer') tradingviewWidgetContainer!: ElementRef;

  constructor(private meta: Meta, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Live Gold, Silver & Platinum Price Chart (1D) – Track Daily Trends');
    this.meta.addTags([
      { name: 'description', content: 'View real-time price charts for Gold, Silver, and Platinum on a daily (1D) timeframe. Track precious metal trends live with our interactive TradingView-powered charts. Ideal for traders, investors, and gold enthusiasts in Kerala and beyond.' },
      { name: 'keywords', content: 'live gold chart, silver price chart, platinum price chart, real-time gold, daily gold trends, TradingView gold, gold price Kerala, gold rates live, precious metals chart' },
      { name: 'author', content: 'goldpricekerala.in' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]);
  }

  ngAfterViewInit(): void {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "740",
      "height": "600",
      "symbol": "TVC:GOLD",
      "interval": "D",
      "timezone": "Asia/Kolkata",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "withdateranges": true,
      "allow_symbol_change": true,
      "watchlist": [
        "TVC:SILVER",
        "TVC:PLATINUM",
        "TVC:GOLD"
      ],
      "support_host": "https://www.tradingview.com"
    });

    if (this.tradingviewWidgetContainer) {
      this.tradingviewWidgetContainer.nativeElement.appendChild(script);
    }
  }
} 