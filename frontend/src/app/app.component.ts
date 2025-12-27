import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
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

  tools = ['Overview', 'Watchlist', 'Movers', 'Risk', 'Allocation'] as const;
  periods = ['7D', '30D', '90D', '1Y'] as const;
  viewModes = ['Summary', 'Detail'] as const;
  themes = ['Light', 'Dim'] as const;
  densities = ['Comfort', 'Compact'] as const;

  activeTool = signal<(typeof this.tools)[number]>('Overview');
  activePeriod = signal<(typeof this.periods)[number]>('30D');
  activeView = signal<(typeof this.viewModes)[number]>('Summary');
  activeTheme = signal<(typeof this.themes)[number]>('Light');
  activeDensity = signal<(typeof this.densities)[number]>('Comfort');

  showKpi = signal(true);
  showChart = signal(true);
  showTable = signal(true);

  summary = signal<SummaryMetrics | null>(null);
  series = signal<TimeSeriesPoint[]>([]);
  topAssets = signal<TopAsset[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  chartLabel = computed(() => {
    const summary = this.summary();
    if (!summary) {
      return 'Price movement';
    }
    return `${summary.symbol} Close`;
  });

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

  selectTool(tool: (typeof this.tools)[number]) {
    this.activeTool.set(tool);
  }

  selectPeriod(period: (typeof this.periods)[number]) {
    this.activePeriod.set(period);
    this.loadData();
  }

  selectViewMode(mode: (typeof this.viewModes)[number]) {
    this.activeView.set(mode);
  }

  selectTheme(theme: (typeof this.themes)[number]) {
    this.activeTheme.set(theme);
  }

  selectDensity(density: (typeof this.densities)[number]) {
    this.activeDensity.set(density);
  }

  private loadData() {
    const symbol = 'aapl';
    const points = this.pointsForPeriod(this.activePeriod());
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      summary: this.metricsApi.getSummary(symbol),
      series: this.metricsApi.getTimeSeries(symbol, points),
      topAssets: this.metricsApi.getTopAssets(['aapl', 'msft', 'amzn', 'goog', 'meta', 'tsla'])
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

  private pointsForPeriod(period: (typeof this.periods)[number]) {
    switch (period) {
      case '7D':
        return 7;
      case '30D':
        return 30;
      case '90D':
        return 90;
      case '1Y':
      default:
        return 252;
    }
  }
}
