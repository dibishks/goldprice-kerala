import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <header class="header">
      <div class="logo">
        <span>Gold Price Kerala</span>
      </div>
      <div class="spacer"></div>
      <nav class="nav-menu">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
        <a routerLink="/blog" routerLinkActive="active">Blog</a>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background-color: #1a237e;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      height: 64px;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: 1px;
    }

    .spacer {
      flex: 1;
    }

    .nav-menu {
      display: flex;
      gap: 1.5rem;
      align-items: center;

      a {
        color: white;
        text-decoration: none;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.active {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    @media (max-width: 768px) {
      .header {
        padding: 1rem;
      }

      .logo {
        font-size: 1.2rem;
      }

      .nav-menu {
        gap: 1rem;

        a {
          font-size: 0.9rem;
          padding: 0.4rem;
        }
      }
    }
  `]
})
export class HeaderComponent {}
