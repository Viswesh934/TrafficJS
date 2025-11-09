// moved from src/realtime.ts
import * as si from "systeminformation";

export async function getRealtimeMetrics() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const disk = await si.fsSize();
  const network = await si.networkStats();

  return {
    cpu: cpu.currentLoad.toFixed(2),
    memoryUsedGB: (mem.active / 1e9).toFixed(2),
    memoryTotalGB: (mem.total / 1e9).toFixed(2),
    diskUsedGB: (disk[0]?.used ? (disk[0].used / 1e9).toFixed(2) : '0.00'),
    diskTotalGB: (disk[0]?.size ? (disk[0].size / 1e9).toFixed(2) : '0.00'),
    netRxMBps: (network[0]?.rx_sec ? (network[0].rx_sec / 1e6).toFixed(2) : '0.00'),
    netTxMBps: (network[0]?.tx_sec ? (network[0].tx_sec / 1e6).toFixed(2) : '0.00')
  };
}
