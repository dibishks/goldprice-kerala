import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {

  constructor(private meta: Meta, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('About Gold Price Kerala – Your Trusted Gold Rate Source');
    this.meta.addTags([
      { name: 'description', content: 'Learn more about Gold Price Kerala – your trusted source for daily 22K and 24K gold rates in Kerala, India. Discover our mission, what we offer, and how we help you track gold market trends.' },
      { name: 'keywords', content: 'about Gold Price Kerala, gold rate source, trusted gold prices, Kerala gold market, gold investment information' },
      { name: 'author', content: 'goldpricekerala.in' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]);
  }
}
