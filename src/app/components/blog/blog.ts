import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  author: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="blog-container">
      <h1>Gold Market Insights</h1>
      <div class="blog-grid">
        <mat-card *ngFor="let post of blogPosts" class="blog-card">
          <mat-card-header>
            <mat-card-title>{{ post.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ post.date }} | By {{ post.author }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ post.excerpt }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Read More</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .blog-card {
      height: 100%;
      display: flex;
      flex-direction: column;

      mat-card-content {
        flex-grow: 1;
      }

      p {
        color: #666;
        line-height: 1.6;
      }
    }

    @media (max-width: 768px) {
      .blog-container {
        padding: 1rem;
      }

      .blog-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BlogComponent {
  blogPosts: BlogPost[] = [
    {
      title: 'Understanding Gold Price Fluctuations in Kerala',
      date: 'May 28, 2024',
      author: 'John Doe',
      excerpt: 'Learn about the factors that influence gold prices in Kerala and how to make informed investment decisions.'
    },
    {
      title: 'The Impact of Global Markets on Local Gold Prices',
      date: 'May 25, 2024',
      author: 'Jane Smith',
      excerpt: 'How international market trends affect gold prices in Kerala and what it means for local investors.'
    },
    {
      title: 'Gold Investment Strategies for 2024',
      date: 'May 20, 2024',
      author: 'Mike Johnson',
      excerpt: 'Expert insights on the best gold investment strategies for the current market conditions.'
    }
  ];
}
