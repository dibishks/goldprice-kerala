import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { marked } from 'marked';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

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
  selector: 'app-blog-viewer',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './blog-viewer.html',
  styleUrls: ['./blog-viewer.css']
})
export class BlogViewerComponent implements OnInit {
  blogContent: string = '';
  blogTags: string[] = [];
  blogDetails: BlogPost | null = null;
  showSharePopup: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id'); // e.g., post1
    if (blogId) {
      this.loadMarkdown(`/assets/blog/${blogId}.md`);
      this.loadBlogDetails(blogId);
    }
  }

  loadMarkdown(path: string): void {
    this.http.get(path, { responseType: 'text' }).subscribe((data) => {
      const result = marked.parse(data);
      if (result instanceof Promise) {
        result.then((html) => (this.blogContent = html));
      } else {
        this.blogContent = result;
      }
    });
  }

  loadBlogDetails(blogId: string): void {
    this.http.get<BlogPost[]>('/assets/blog/blog-index.json').subscribe({
      next: (posts) => {
        const post = posts.find(p => p.id === blogId);
        if (post) {
          this.blogDetails = post;
          this.blogTags = post.tags;
        }
      },
      error: (error) => {
        console.error('Error loading blog details:', error);
      }
    });
  }

  onTagClick(tag: string): void {
    this.router.navigate(['/blog'], { queryParams: { tag: tag } });
  }

  toggleSharePopup(): void {
    this.showSharePopup = !this.showSharePopup;
  }

  copyLink(): void {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('Link copied to clipboard!');
      this.showSharePopup = false;
    }).catch(err => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy link.');
    });
  }

  shareOnInstagram(): void {
    const currentUrl = window.location.href;
    const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`;
    window.open(instagramShareUrl, '_blank');
    this.showSharePopup = false;
  }

  shareOnFacebook(): void {
    const currentUrl = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookShareUrl, '_blank');
    this.showSharePopup = false;
  }
}
