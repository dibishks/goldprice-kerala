import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { JsonLdComponent } from './components/json-ld/json-ld.component';
import { generatePageTitle, generateOpenGraphTags } from './utils/seo.utils';
import { JsonLdService } from './services/json-ld.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    JsonLdComponent
  ],
  template: `
    <app-json-ld [jsonLD]="jsonLD"></app-json-ld>
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  jsonLD: any;

  constructor(
    private meta: Meta,
    private title: Title,
    private jsonLdService: JsonLdService
  ) {}

  ngOnInit(): void {
    this.title.setTitle(generatePageTitle());

    this.meta.addTags([
      { name: 'author', content: 'goldpricekerala.in' },
      { name: 'description', content: 'Kerala Gold Price Today - Check daily 22K gold rate in Kerala (₹/gram & Pavan), updated every morning at 10 AM. View 7-day highs/lows and 30-day history. Trusted source for gold investors and buyers in Kerala.' },
      { name: 'keywords', content: 'gold price Kerala, 22k gold rate, today pavan rate, gold price chart, gold history Kerala, buy gold Kerala, Kerala jewellery, diamond jewellery, platinum price, silver rate Kerala, trending jewellery designs' },
      { name: 'robots', content: 'index, follow' },
      { name: 'revisit-after', content: '1 day' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]);

    this.meta.addTags(generateOpenGraphTags());

    this.jsonLD = this.jsonLdService.generateGoldPriceJsonLD(6500);
  }
}
