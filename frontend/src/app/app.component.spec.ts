import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { MetricsApiService } from './api/metrics-api.service';

const metricsApiStub = {
  getSummary: () =>
    of({
      symbol: 'AAPL',
      latest: 180,
      changeAbs: 1.2,
      changePct: 0.67,
      rangeHigh: 190,
      rangeLow: 170
    }),
  getTimeSeries: () =>
    of([
      { date: '2024-01-01', value: 175 },
      { date: '2024-01-02', value: 180 }
    ]),
  getTopAssets: () =>
    of([
      { symbol: 'AAPL', latest: 180, changePct: 0.67 },
      { symbol: 'MSFT', latest: 320, changePct: 0.42 }
    ])
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: MetricsApiService, useValue: metricsApiStub }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the dashboard title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Financial Dashboard');
  });

  it('should render toolbar tools', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.chip').length).toBeGreaterThan(0);
  });
});
