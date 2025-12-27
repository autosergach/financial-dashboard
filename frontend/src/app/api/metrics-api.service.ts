import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import type { SummaryMetrics, TimeSeriesPoint, TopAsset } from '../models/metrics';

const API_BASE_URL = '/api';

type ApiResponse<T> = {
  data: T;
};

@Injectable({ providedIn: 'root' })
export class MetricsApiService {
  constructor(private readonly http: HttpClient) {}

  getSummary(symbol = 'aapl') {
    return this.http
      .get<ApiResponse<SummaryMetrics>>(`${API_BASE_URL}/metrics/summary`, {
        params: { symbol }
      })
      .pipe(map((response) => response.data));
  }

  getTimeSeries(symbol = 'aapl', points = 30) {
    return this.http
      .get<ApiResponse<TimeSeriesPoint[]>>(`${API_BASE_URL}/metrics/timeseries`, {
        params: { symbol, points }
      })
      .pipe(map((response) => response.data));
  }

  getTopAssets(symbols?: string[]) {
    if (symbols && symbols.length > 0) {
      return this.http
        .get<ApiResponse<TopAsset[]>>(`${API_BASE_URL}/metrics/top-assets`, {
          params: { symbols: symbols.join(',') }
        })
        .pipe(map((response) => response.data));
    }

    return this.http
      .get<ApiResponse<TopAsset[]>>(`${API_BASE_URL}/metrics/top-assets`)
      .pipe(map((response) => response.data));
  }
}
