// moved from src/loadScore.ts
export interface LoadScoreInput {
  cpu: string | number;
  memoryUsedGB: string | number;
  memoryTotalGB: string | number;
  netTxMBps: string | number;
  netRxMBps: string | number;
}

export function calculateLoadScore({
  cpu,
  memoryUsedGB,
  memoryTotalGB,
  netTxMBps,
  netRxMBps
}: LoadScoreInput): string {
  const cpuNum = typeof cpu === 'string' ? parseFloat(cpu) : cpu;
  const memUsed = typeof memoryUsedGB === 'string' ? parseFloat(memoryUsedGB) : memoryUsedGB;
  const memTotal = typeof memoryTotalGB === 'string' ? parseFloat(memoryTotalGB) : memoryTotalGB;
  const netTx = typeof netTxMBps === 'string' ? parseFloat(netTxMBps) : netTxMBps;
  const netRx = typeof netRxMBps === 'string' ? parseFloat(netRxMBps) : netRxMBps;

  const memPercent = (memUsed / memTotal) * 100;
  const netLoad = Math.min((netRx + netTx) * 10, 100);
  const score = 0.5 * cpuNum + 0.3 * memPercent + 0.2 * netLoad;
  
  return Math.min(score, 100).toFixed(2);
}