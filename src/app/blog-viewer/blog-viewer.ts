import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { marked, Renderer, Tokens } from 'marked';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

// Custom Marked renderer to open links in new tabs
const renderer = new Renderer();
const originalLinkRenderer = renderer.link;

// The signature of the link method in marked is `(token: Tokens.Link) => string`
renderer.link = (token: Tokens.Link): string => {
  // Pass the entire token object to the original renderer's call method
  const html = originalLinkRenderer.call(renderer, token);
  return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
};

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
      // Use the custom renderer when parsing Markdown
      const result = marked.parse(data, { renderer: renderer });
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

  shareOnWhatsapp(): void {
    const currentUrl = window.location.href;
    // WhatsApp Web URL for sharing. For mobile, it might try to open the app.
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
    window.open(whatsappShareUrl, '_blank');
    this.showSharePopup = false;
  }
}
