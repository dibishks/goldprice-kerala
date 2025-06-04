import { MetaDefinition } from '@angular/platform-browser';

export function getFormattedDate(): string {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

export function generatePageTitle(): string {
  const date = getFormattedDate();
  return `Kerala Gold Price Today - 22K Gold Rate | ${date}`;
}

export function generateOpenGraphTags(): MetaDefinition[] {
  const title = generatePageTitle();
  const description = 'Kerala Gold Price Today - Check daily 22K gold rate in Kerala (₹/gram & Pavan), updated every morning at 10 AM. View 7-day highs/lows and 30-day history.';
  const url = 'https://goldpricekerala.in';
  const image = 'https://goldpricekerala.in/assets/images/og-image.jpg';

  return [
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:url', content: url },
    { name: 'og:image', content: image },
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: 'Gold Price Kerala' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image }
  ];
} 