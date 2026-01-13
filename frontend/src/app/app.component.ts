import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MetricsApiService } from './api/metrics-api.service';
import type { SummaryMetrics, TimeSeriesPoint, TopAsset } from './models/metrics';

type Tool = 'Overview' | 'Watchlist' | 'Movers' | 'Risk' | 'Allocation';
type Period = '7D' | '30D' | '90D' | '1Y';
type ViewMode = 'Summary' | 'Detail';
type ThemeMode = 'Light' | 'Dim';
type DensityMode = 'Comfort' | 'Compact';
type SymbolValue = 'aapl' | 'msft' | 'amzn' | 'goog' | 'meta' | 'tsla';

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

  tools: Tool[] = ['Overview', 'Watchlist', 'Movers', 'Risk', 'Allocation'];
  periods: Period[] = ['7D', '30D', '90D', '1Y'];
  viewModes: ViewMode[] = ['Summary', 'Detail'];
  themes: ThemeMode[] = ['Light', 'Dim'];
  densities: DensityMode[] = ['Comfort', 'Compact'];
  symbols = [
    { label: 'AAPL', value: 'aapl' },
    { label: 'MSFT', value: 'msft' },
    { label: 'AMZN', value: 'amzn' },
    { label: 'GOOG', value: 'goog' },
    { label: 'META', value: 'meta' },
    { label: 'TSLA', value: 'tsla' }
  ] as const;

  activeTool = signal<Tool>('Overview');
  activePeriod = signal<Period>('30D');
  activeView = signal<ViewMode>('Summary');
  activeTheme = signal<ThemeMode>('Light');
  activeDensity = signal<DensityMode>('Comfort');
  activeSymbol = signal<SymbolValue>('aapl');

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
    this.restorePreferences();
    this.loadData();
  }

  selectTool(tool: Tool) {
    this.activeTool.set(tool);
    this.persistPreferences();
  }

  selectPeriod(period: Period) {
    this.activePeriod.set(period);
    this.persistPreferences();
    this.loadData();
  }

  selectViewMode(mode: ViewMode) {
    this.activeView.set(mode);
    this.persistPreferences();
  }

  selectTheme(theme: ThemeMode) {
    this.activeTheme.set(theme);
    this.persistPreferences();
  }

  selectDensity(density: DensityMode) {
    this.activeDensity.set(density);
    this.persistPreferences();
  }

  selectSymbol(symbol: SymbolValue) {
    this.activeSymbol.set(symbol);
    this.persistPreferences();
    this.loadData();
  }

  toggleWidget(widget: 'kpi' | 'chart' | 'table') {
    switch (widget) {
      case 'kpi':
        this.showKpi.set(!this.showKpi());
        break;
      case 'chart':
        this.showChart.set(!this.showChart());
        break;
      case 'table':
        this.showTable.set(!this.showTable());
        break;
    }
    this.persistPreferences();
  }

  private loadData() {
    const symbol = this.activeSymbol();
    const points = this.pointsForPeriod(this.activePeriod());
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      summary: this.metricsApi.getSummary(symbol),
      series: this.metricsApi.getTimeSeries(symbol, points),
      topAssets: this.metricsApi.getTopAssets(this.symbols.map((item) => item.value))
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

  private pointsForPeriod(period: Period) {
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

  private persistPreferences() {
    const preferences = {
      tool: this.activeTool(),
      period: this.activePeriod(),
      view: this.activeView(),
      theme: this.activeTheme(),
      density: this.activeDensity(),
      symbol: this.activeSymbol(),
      widgets: {
        kpi: this.showKpi(),
        chart: this.showChart(),
        table: this.showTable()
      }
    };

    try {
      localStorage.setItem('fd.preferences', JSON.stringify(preferences));
    } catch {
      // ignore storage errors
    }
  }

  private restorePreferences() {
    try {
      const raw = localStorage.getItem('fd.preferences');
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<{
        tool: Tool;
        period: Period;
        view: ViewMode;
        theme: ThemeMode;
        density: DensityMode;
        symbol: SymbolValue;
        widgets: { kpi: boolean; chart: boolean; table: boolean };
      }>;

      if (parsed.tool && this.tools.includes(parsed.tool)) {
        this.activeTool.set(parsed.tool);
      }
      if (parsed.period && this.periods.includes(parsed.period)) {
        this.activePeriod.set(parsed.period);
      }
      if (parsed.view && this.viewModes.includes(parsed.view)) {
        this.activeView.set(parsed.view);
      }
      if (parsed.theme && this.themes.includes(parsed.theme)) {
        this.activeTheme.set(parsed.theme);
      }
      if (parsed.density && this.densities.includes(parsed.density)) {
        this.activeDensity.set(parsed.density);
      }
      if (parsed.symbol && this.symbols.some((item) => item.value === parsed.symbol)) {
        this.activeSymbol.set(parsed.symbol);
      }
      if (parsed.widgets) {
        this.showKpi.set(parsed.widgets.kpi);
        this.showChart.set(parsed.widgets.chart);
        this.showTable.set(parsed.widgets.table);
      }
    } catch {
      // ignore storage errors
    }
  }
}
