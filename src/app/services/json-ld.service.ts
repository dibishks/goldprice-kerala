import { Injectable } from '@angular/core';
import { getFormattedDate } from '../utils/seo.utils';

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
  generateGoldPriceJsonLD(goldPrice: number) {
    const date = getFormattedDate();
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: '22K Gold Price in Kerala',
      description: 'Current gold price in Kerala for 22K gold',
      brand: {
        '@type': 'Brand',
        name: 'Gold Price Kerala'
      },
      offers: {
        '@type': 'Offer',
        price: goldPrice,
        priceCurrency: 'INR',
        priceValidUntil: new Date().toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Gold Price Kerala'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '1250'
      }
    };
  }
} 