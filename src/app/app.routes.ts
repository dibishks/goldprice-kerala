import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { BlogComponent } from './components/blog/blog';
import { BlogViewerComponent } from './blog-viewer/blog-viewer';
import { LiveGoldChartComponent } from './components/live-gold-chart/live-gold-chart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogViewerComponent },
  { path: 'price-charts/live-gold-chart', component: LiveGoldChartComponent },
  { path: '**', redirectTo: '' }
];
