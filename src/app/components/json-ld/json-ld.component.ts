import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-ld',
  standalone: true,
  imports: [CommonModule],
  template: `
    <script type="application/ld+json">
      {{ jsonLD | json }}
    </script>
  `
})
export class JsonLdComponent implements OnInit {
  @Input() jsonLD: any;

  ngOnInit() {
    // Ensure the JSON-LD is properly formatted
    if (typeof this.jsonLD === 'string') {
      this.jsonLD = JSON.parse(this.jsonLD);
    }
  }
} 