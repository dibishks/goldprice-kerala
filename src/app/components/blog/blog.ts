import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
import { Router } from '@angular/router';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  publishedDate: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink, MatChipsModule],
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class BlogComponent implements OnInit {
  allBlogPosts: BlogPost[] = [];
  displayBlogPosts: BlogPost[] = [];
  postsPerPage = 10;
  currentPage = 0;
  isLoading = false;
  indexFilePath = '/assets/blog/blog-index.json';

  selectedCategory: string | null = null;
  selectedTag: string | null = null;
  uniqueCategories: string[] = [];
  uniqueTags: string[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<BlogPost[]>(this.indexFilePath).subscribe({
      next: (posts) => {
        this.allBlogPosts = posts;
        console.log('All Blog Posts loaded:', this.allBlogPosts); // Debugging log
        this.extractUniqueCategoriesAndTags();

        // After allBlogPosts are loaded, subscribe to query params and apply initial filters
        this.route.queryParamMap.subscribe(params => {
          const tag = params.get('tag');
          if (tag) {
            this.selectedTag = tag; // Set the selected tag from URL
          } else {
            this.selectedTag = null; // Clear tag if not in URL
          }
          this.selectedCategory = null; // Clear category on initial load/tag filter

          this.currentPage = 0; // Reset pagination for initial filter
          this.displayBlogPosts = []; // Clear current displayed posts
          console.log('Applying filters with selectedTag:', this.selectedTag, 'selectedCategory:', this.selectedCategory, 'currentPage:', this.currentPage); // Debugging log
          this.updateDisplayedPosts(true); // Apply filters based on URL or no filter
          console.log('Display Blog Posts after applyFilters:', this.displayBlogPosts); // Debugging log
          this.isLoading = false; // Set loading to false after initial posts are displayed
        });

      },
      error: (error) => {
        console.error('Error loading blog index:', error);
        this.isLoading = false;
      }
    });
  }

  loadMorePosts(): void {
    if (this.isLoading || !this.hasMorePosts()) {
      return;
    }

    this.isLoading = true;
    this.currentPage++;
    console.log('Loading more posts. Current Page:', this.currentPage); // Debugging log
    this.updateDisplayedPosts(false);
    console.log('Display Blog Posts after loadMorePosts:', this.displayBlogPosts); // Debugging log
    this.isLoading = false;
  }

  hasMorePosts(): boolean {
    const filteredPosts = this.getFilteredPosts();
    return this.displayBlogPosts.length < filteredPosts.length;
  }

  private getFilteredPosts(): BlogPost[] {
    let filtered = [...this.allBlogPosts];

    if (this.selectedCategory) {
      filtered = filtered.filter(post => post.category === this.selectedCategory);
    }

    if (this.selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(this.selectedTag!));
    }
    return filtered;
  }

  updateDisplayedPosts(reset: boolean): void {
    const filteredPosts = this.getFilteredPosts();
    const startIndex = this.currentPage * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;

    if (reset) {
      this.displayBlogPosts = filteredPosts.slice(startIndex, endIndex);
    } else {
      const newPosts = filteredPosts.slice(startIndex, endIndex);
      this.displayBlogPosts = [...this.displayBlogPosts, ...newPosts];
    }
    this.isLoading = false; // Moved here as posts are now displayed
    console.log('Final displayBlogPosts length after updateDisplayedPosts:', this.displayBlogPosts.length); // Debugging log
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.selectedTag = null;
    this.currentPage = 0;
    this.displayBlogPosts = [];
    console.log('filterByCategory called. category:', category); // Debugging log
    this.updateDisplayedPosts(true);
  }

  filterByTag(tag: string | null): void {
    this.selectedTag = tag;
    this.selectedCategory = null;
    this.currentPage = 0;
    this.displayBlogPosts = [];
    console.log('filterByTag called. tag:', tag); // Debugging log
    this.updateDisplayedPosts(true);
  }

  extractUniqueCategoriesAndTags(): void {
    const categories = new Set<string>();
    const tags = new Set<string>();
    this.allBlogPosts.forEach(post => {
      categories.add(post.category);
      post.tags.forEach(tag => tags.add(tag));
    });
    this.uniqueCategories = Array.from(categories);
    this.uniqueTags = Array.from(tags);
  }

  // New methods for mat-chip-listbox selectionChange event
  onCategoryListboxChange(event: any): void {
    this.filterByCategory(event.value === 'null' ? null : event.value);
  }

  onTagListboxChange(event: any): void {
    this.filterByTag(event.value === 'null' ? null : event.value);
  }

  // Helper methods to handle clicks on individual chips
  onCategoryChipClick(category: string): void {
    this.filterByCategory(category);
  }

  onTagChipClick(tag: string): void {
    this.filterByTag(tag);
  }
}
