import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class BlogComponent implements OnInit {
  allBlogPosts: BlogPost[] = [];
  displayBlogPosts: BlogPost[] = [];
  postsPerPage = 5;
  currentPage = 0; // Start at 0, will increment after loading the first page
  isLoading = false;
  indexFilePath = '/assets/blog/blog-index.json';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBlogIndex();
  }

  loadBlogIndex(): void {
    this.isLoading = true;
    this.http.get<BlogPost[]>(this.indexFilePath).subscribe({
      next: (posts) => {
        this.allBlogPosts = posts;
        this.currentPage = 0; // Ensure current page is 0 for initial load
        this.displayBlogPosts = []; // Clear any previous posts

        // Load the first batch of posts directly after fetching index
        const initialPosts = this.allBlogPosts.slice(0, this.postsPerPage);
        this.displayBlogPosts = [...this.displayBlogPosts, ...initialPosts];
        this.currentPage = 1; // Increment page counter after loading the first page

        this.isLoading = false; // Set loading to false after initial posts are displayed
      },
      error: (error) => {
        console.error('Error loading blog index:', error);
        this.isLoading = false; // Set to false on error
      }
    });
  }

  loadMorePosts(): void {
     // Prevent loading more if already loading or no more posts available
    if (this.isLoading || !this.hasMorePosts()) {
      return;
    }

    this.isLoading = true; // Indicate loading for subsequent batches

    const startIndex = this.currentPage * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const newPosts = this.allBlogPosts.slice(startIndex, endIndex);

    // Use a slight delay to allow loading indicator to show briefly
    setTimeout(() => {
      this.displayBlogPosts = [...this.displayBlogPosts, ...newPosts];
      this.currentPage++;
      this.isLoading = false; // Set isLoading to false after adding posts
    }, 100);
  }

  hasMorePosts(): boolean {
    // Check if there are still posts in allBlogPosts that haven't been displayed
    return this.displayBlogPosts.length < this.allBlogPosts.length;
  }
}
