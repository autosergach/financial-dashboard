import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MetricsApiService } from './api/metrics-api.service';
import type { SummaryMetrics, TimeSeriesPoint, TopAsset } from './models/metrics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly metricsApi = inject(MetricsApiService);

  summary = signal<SummaryMetrics | null>(null);
  series = signal<TimeSeriesPoint[]>([]);
  topAssets = signal<TopAsset[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'AAPL Close',
        borderColor: '#1b6373',
        backgroundColor: 'rgba(27, 99, 115, 0.15)',
        fill: true,
        pointRadius: 0,
        tension: 0.35
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 6 }
      },
      y: {
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        ticks: { maxTicksLimit: 6 }
      }
    }
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    const symbol = 'aapl';
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      summary: this.metricsApi.getSummary(symbol),
      series: this.metricsApi.getTimeSeries(symbol, 30),
      topAssets: this.metricsApi.getTopAssets()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ summary, series, topAssets }) => {
          this.summary.set(summary);
          this.series.set(series);
          this.topAssets.set(topAssets);
          this.updateChart(summary, series);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load market data. Try again later.');
          this.loading.set(false);
        }
      });
  }

  private updateChart(summary: SummaryMetrics, series: TimeSeriesPoint[]) {
    this.lineChartData = {
      labels: series.map((point) => point.date),
      datasets: [
        {
          data: series.map((point) => point.value),
          label: `${summary.symbol} Close`,
          borderColor: '#1b6373',
          backgroundColor: 'rgba(27, 99, 115, 0.15)',
          fill: true,
          pointRadius: 0,
          tension: 0.35
        }
      ]
    };
  }
}
