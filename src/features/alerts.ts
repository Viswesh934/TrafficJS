// moved from src/alerts.ts
export interface AlertInput {
  cpu: string | number;
  memoryUsedGB: string | number;
  memoryTotalGB: string | number;
  diskUsedGB: string | number;
  diskTotalGB: string | number;
  netRxMBps?: string | number;
  netTxMBps?: string | number;
  loadScore: string | number;
}

export interface AlertResult {
  level: 'info' | 'warning' | 'critical';
  message: string;
  emoji: string;
  timestamp: string;
}

export function checkAlerts({ 
  cpu, 
  memoryUsedGB, 
  memoryTotalGB, 
  diskUsedGB, 
  diskTotalGB,
  netRxMBps = 0,
  netTxMBps = 0,
  loadScore 
}: AlertInput): AlertResult[] {
  const alerts: AlertResult[] = [];
  const timestamp = new Date().toLocaleString();
  
  const cpuNum = typeof cpu === 'string' ? parseFloat(cpu) : cpu;
  const memUsed = typeof memoryUsedGB === 'string' ? parseFloat(memoryUsedGB) : memoryUsedGB;
  const memTotal = typeof memoryTotalGB === 'string' ? parseFloat(memoryTotalGB) : memoryTotalGB;
  const diskUsed = typeof diskUsedGB === 'string' ? parseFloat(diskUsedGB) : diskUsedGB;
  const diskTotal = typeof diskTotalGB === 'string' ? parseFloat(diskTotalGB) : diskTotalGB;
  const netRx = typeof netRxMBps === 'string' ? parseFloat(netRxMBps) : netRxMBps;
  const netTx = typeof netTxMBps === 'string' ? parseFloat(netTxMBps) : netTxMBps;
  const loadNum = typeof loadScore === 'string' ? parseFloat(loadScore) : loadScore;

  const memPercent = (memUsed / memTotal) * 100;
  const diskPercent = (diskUsed / diskTotal) * 100;
  const totalNetworkMBps = netRx + netTx;

  // Critical alerts
  if (cpuNum > 90) {
    alerts.push({
      level: 'critical',
      message: `CPU usage critically high: ${cpuNum.toFixed(1)}%`,
      emoji: '🚨',
      timestamp
    });
  }

  if (memPercent > 95) {
    alerts.push({
      level: 'critical',
      message: `Memory almost exhausted: ${memPercent.toFixed(1)}%`,
      emoji: '🚨',
      timestamp
    });
  }

  if (diskPercent > 95) {
    alerts.push({
      level: 'critical',
      message: `Disk space critically low: ${diskPercent.toFixed(1)}%`,
      emoji: '🚨',
      timestamp
    });
  }

  if (loadNum > 85) {
    alerts.push({
      level: 'critical',
      message: `Overall system load critical: ${loadNum.toFixed(1)}%`,
      emoji: '🚨',
      timestamp
    });
  }

  // Warning alerts
  if (cpuNum > 75 && cpuNum <= 90) {
    alerts.push({
      level: 'warning',
      message: `High CPU usage: ${cpuNum.toFixed(1)}%`,
      emoji: '⚠️',
      timestamp
    });
  }

  if (memPercent > 80 && memPercent <= 95) {
    alerts.push({
      level: 'warning',
      message: `High memory usage: ${memPercent.toFixed(1)}%`,
      emoji: '⚠️',
      timestamp
    });
  }

  if (diskPercent > 85 && diskPercent <= 95) {
    alerts.push({
      level: 'warning',
      message: `Disk space running low: ${diskPercent.toFixed(1)}%`,
      emoji: '⚠️',
      timestamp
    });
  }

  if (totalNetworkMBps > 50) {
    alerts.push({
      level: 'warning',
      message: `High network activity: ${totalNetworkMBps.toFixed(2)} MBps`,
      emoji: '📡',
      timestamp
    });
  }

  if (loadNum > 65 && loadNum <= 85) {
    alerts.push({
      level: 'warning',
      message: `Elevated system load: ${loadNum.toFixed(1)}%`,
      emoji: '⚠️',
      timestamp
    });
  }

  // If no alerts, system is healthy
  if (alerts.length === 0) {
    alerts.push({
      level: 'info',
      message: `System operating normally (Load: ${loadNum.toFixed(1)}%)`,
      emoji: '✅',
      timestamp
    });
  }

  return alerts;
}

export function printAlerts(alerts: AlertResult[]): void {
  console.log('\n🔔 System Alerts:');
  alerts.forEach(alert => {
    console.log(`${alert.emoji} [${alert.level.toUpperCase()}] ${alert.message}`);
  });
  console.log('');
}