import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.html',
})
export class BlogViewerComponent implements OnInit {
  blogContent: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id'); // e.g., post1
    if (blogId) {
      this.loadMarkdown(`/assets/blog/${blogId}.md`);
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
}
