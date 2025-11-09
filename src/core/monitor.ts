// moved from src/monitor.ts
import { getRealtimeMetrics } from "./realtime";
import { calculateLoadScore } from "@/features/loadScore";
import { saveReport } from "@/features/saveReport";
import { addMetricSnapshot, getTrend, getMovingAverage } from "@/features/trends";
import { generateSummary, generateShortSummary } from "@/features/reportSummary";
import { checkAlerts, printAlerts } from "@/features/alerts";
import fs from "fs";
import path from "path";

export interface MonitorConfig {
  interval?: number; // milliseconds
  saveReports?: boolean;
  saveSummary?: boolean;
  printToConsole?: boolean;
  enableTrends?: boolean;
}

const DEFAULT_CONFIG: MonitorConfig = {
  interval: 60 * 1000, // 1 minute
  saveReports: true,
  saveSummary: true,
  printToConsole: true,
  enableTrends: true
};

export async function runMonitorCycle(config: MonitorConfig = {}): Promise<void> {
  const options = { ...DEFAULT_CONFIG, ...config };
  
  try {
    // Get real-time metrics
    const rt = await getRealtimeMetrics();
    const score = calculateLoadScore(rt);
    
    // Add to trend tracking if enabled
    if (options.enableTrends) {
      addMetricSnapshot(rt);
    }
    
    // Generate alerts
    const alerts = checkAlerts({ ...rt, loadScore: score });
    
    if (options.printToConsole) {
      // Print current status
      const shortSummary = generateShortSummary(rt, score);
      console.log(`\n📊 ${new Date().toLocaleTimeString()} - ${shortSummary}`);
      
      // Print trends if available
      if (options.enableTrends) {
        const cpuTrend = getTrend("cpu");
        const memTrend = getTrend("memoryUsedGB");
        const loadTrend = getTrend("loadScore");
        
        if (cpuTrend) {
          const arrow = cpuTrend.direction === 'up' ? '📈' : cpuTrend.direction === 'down' ? '📉' : '➡️';
          console.log(`${arrow} CPU trend: ${cpuTrend.change}% since last check`);
        }
        
        if (memTrend) {
          const arrow = memTrend.direction === 'up' ? '📈' : memTrend.direction === 'down' ? '📉' : '➡️';
          console.log(`${arrow} Memory trend: ${memTrend.change}% since last check`);
        }
        
        if (loadTrend) {
          const arrow = loadTrend.direction === 'up' ? '📈' : loadTrend.direction === 'down' ? '📉' : '➡️';
          console.log(`${arrow} Load Score trend: ${loadTrend.change}% since last check`);
        }
        // Show 5-period moving average
        const avgLoad = getMovingAverage("cpu", 5);
        if (avgLoad) {
          console.log(`📊 CPU 5-period average: ${avgLoad}%`);
        }
      }
      
      // Print alerts
      printAlerts(alerts);
    }
    
    // Generate and save reports
    const reportData = {
      ...rt,
      loadScore: score,
      alerts: alerts.map(a => ({ level: a.level, message: a.message, emoji: a.emoji }))
    };
    
    if (options.saveReports) {
      await saveReport(reportData);
    }
    
    if (options.saveSummary) {
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      // Generate and save markdown summary
      const summary = generateSummary(rt, score);
      const summaryPath = path.join(reportsDir, "latest-summary.md");
      fs.writeFileSync(summaryPath, summary);
      
      if (options.printToConsole) {
        console.log("📝 Markdown summary updated: reports/latest-summary.md");
      }
    }
    
    if (options.printToConsole) {
      console.log("✅ Monitor cycle complete");
      console.log("─".repeat(60));
    }
    
  } catch (error) {
    console.error("❌ Monitor cycle failed:", error);
  }
}

export function startContinuousMonitoring(config: MonitorConfig = {}): NodeJS.Timeout {
  const options = { ...DEFAULT_CONFIG, ...config };
  
  console.log("🚀 Starting TrafficJS Real-time System Monitor");
  console.log(`⏱️  Monitoring interval: ${options.interval! / 1000}s`);
  console.log(`📁 Save reports: ${options.saveReports ? '✅' : '❌'}`);
  console.log(`📄 Save summaries: ${options.saveSummary ? '✅' : '❌'}`);
  console.log(`🖥️  Console output: ${options.printToConsole ? '✅' : '❌'}`);
  console.log(`📈 Trend tracking: ${options.enableTrends ? '✅' : '❌'}`);
  console.log("═".repeat(60));
  
  // Run initial cycle
  runMonitorCycle(options);
  
  // Start interval
  return setInterval(() => {
    runMonitorCycle(options);
  }, options.interval!);
}

export function stopContinuousMonitoring(timer: NodeJS.Timeout): void {
  clearInterval(timer);
  console.log("🛑 Monitoring stopped");
}

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🧠 TrafficJS System Monitor - Starting...");
  startContinuousMonitoring();
}