import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;

  constructor() {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close any open dropdowns when toggling mobile menu
    this.activeDropdown = null;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null; // Also close any open dropdowns
  }

  toggleDropdown(menu: string): void {
    // Only toggle on click for mobile/small screens
    if (window.innerWidth <= 768) {
      this.activeDropdown = this.activeDropdown === menu ? null : menu;
    }
  }

  openDropdown(menu: string): void {
    // Only open on hover for larger screens
    if (window.innerWidth > 768) {
      this.activeDropdown = menu;
    }
  }

  closeDropdown(menu: string): void {
    // Only close on hover for larger screens
    if (window.innerWidth > 768) {
      this.activeDropdown = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Close mobile menu and dropdowns if screen resizes to desktop size
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.activeDropdown = null;
    }
  }
}
