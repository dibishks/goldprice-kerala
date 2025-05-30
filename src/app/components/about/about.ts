import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="about-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>About Gold Price Kerala</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Gold Price Kerala is your trusted source for real-time gold prices in Kerala, India.
            We provide accurate and up-to-date information about gold prices, helping you make
            informed decisions about your gold investments.
          </p>
          <h3>Our Mission</h3>
          <p>
            Our mission is to provide transparent and reliable gold price information to the
            people of Kerala, making it easier for them to track and understand gold market
            trends.
          </p>
          <h3>What We Offer</h3>
          <ul>
            <li>Live gold prices for 22K and 24K gold</li>
            <li>Historical price data and trends</li>
            <li>Daily price updates and analysis</li>
            <li>Price predictions and market insights</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    mat-card {
      margin-bottom: 2rem;
    }

    h3 {
      margin: 1.5rem 0 1rem;
      color: #333;
    }

    p {
      line-height: 1.6;
      color: #666;
    }

    ul {
      list-style-type: disc;
      padding-left: 2rem;
      color: #666;
      
      li {
        margin: 0.5rem 0;
      }
    }
  `]
})
export class AboutComponent {}
