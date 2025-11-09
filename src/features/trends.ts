// moved from src/trends.ts
export interface MetricSnapshot {
  [key: string]: any;
}

export interface TrendResult {
  latest: number;
  change: string;
  direction: 'up' | 'down' | 'stable';
}

let history: MetricSnapshot[] = [];

export function addMetricSnapshot(snapshot: MetricSnapshot): void {
  history.push({
    ...snapshot,
    timestamp: Date.now()
  });
  
  // Keep only last 10 snapshots
  if (history.length > 10) {
    history.shift();
  }
}

export function getTrend(key: string): TrendResult | null {
  if (history.length < 2) return null;
  
  const latestSnapshot = history[history.length - 1];
  const prevSnapshot = history[history.length - 2];
  
  if (!latestSnapshot || !prevSnapshot) return null;
  
  const latest = parseFloat(latestSnapshot[key]);
  const prev = parseFloat(prevSnapshot[key]);
  
  if (isNaN(latest) || isNaN(prev)) return null;
  
  const delta = ((latest - prev) / prev) * 100;
  const change = delta.toFixed(2);
  
  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(delta) < 0.1) direction = 'stable';
  else if (delta > 0) direction = 'up';
  else direction = 'down';
  
  return { latest, change, direction };
}

export function getHistory(): MetricSnapshot[] {
  return [...history];
}

export function clearHistory(): void {
  history = [];
}

export function getMovingAverage(key: string, periods: number = 5): number | null {
  if (history.length < periods) return null;
  
  const recentHistory = history.slice(-periods);
  const values = recentHistory.map(h => parseFloat(h[key])).filter(v => !isNaN(v));
  
  if (values.length === 0) return null;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / values.length).toFixed(2));
}