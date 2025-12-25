export type SummaryMetrics = {
  symbol: string;
  latest: number;
  changeAbs: number;
  changePct: number;
  rangeHigh: number;
  rangeLow: number;
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type TopAsset = {
  symbol: string;
  latest: number;
  changePct: number;
};
