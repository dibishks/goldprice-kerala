import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} Gold Price Kerala. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #333;
      color: white;
      padding: 1rem;
      text-align: center;
      position: relative;
      bottom: 0;
      width: 100%;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
