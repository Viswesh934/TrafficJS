// moved from src/realtimeDemo.ts
import { getRealtimeMetrics } from '@/core/realtime';
import { calculateLoadScore } from '@/features/loadScore';
import { generateSummary } from '@/features/reportSummary';
import { checkAlerts, printAlerts } from '@/features/alerts';
import { addMetricSnapshot, getTrend } from '@/features/trends';
import { startContinuousMonitoring, stopContinuousMonitoring } from '@/core/monitor';

async function demonstrateRealtimeFeatures() {
  console.log('🚀 TrafficJS Real-time Monitoring Demo\n');

  // 1. Get current system metrics
  console.log('📊 Getting real-time system metrics...');
  const metrics = await getRealtimeMetrics();
  console.log('Current metrics:', metrics);

  // 2. Calculate load score
  const loadScore = calculateLoadScore(metrics);
  console.log(`\n🧠 System load score: ${loadScore}%`);

  // 3. Check for alerts
  console.log('\n🔔 Checking system alerts...');
  const alerts = checkAlerts({ ...metrics, loadScore });
  printAlerts(alerts);

  // 4. Generate markdown summary
  console.log('📝 Generating system report...');
  const summary = generateSummary(metrics, loadScore);
  console.log('Summary preview:');
  console.log(summary.split('\n').slice(0, 10).join('\n') + '...\n');

  // 5. Demonstrate trend tracking
  console.log('📈 Demonstrating trend tracking...');
  addMetricSnapshot({ ...metrics, loadScore: parseFloat(loadScore) });
  
  // Simulate another reading (with slightly different values)
  const simulatedMetrics = {
    ...metrics,
    cpu: (parseFloat(metrics.cpu) + Math.random() * 10 - 5).toFixed(2),
    memoryUsedGB: (parseFloat(metrics.memoryUsedGB) + Math.random() * 0.5 - 0.25).toFixed(2)
  };
  addMetricSnapshot({ ...simulatedMetrics, loadScore: parseFloat(calculateLoadScore(simulatedMetrics)) });
  
  const cpuTrend = getTrend('cpu');
  if (cpuTrend) {
    console.log(`CPU trend: ${cpuTrend.change}% (${cpuTrend.direction})`);
  }

  console.log('\n✅ Demo complete! You can now use:');
  console.log('• getRealtimeMetrics() - Get current system stats');
  console.log('• calculateLoadScore() - Get overall system load');
  console.log('• checkAlerts() - Monitor for issues');
  console.log('• startContinuousMonitoring() - Run continuous monitoring');
  console.log('\n💡 Try: startContinuousMonitoring({ interval: 30000 }) for 30-second monitoring');
}

// Example of starting continuous monitoring
export function startDemo(intervalSeconds: number = 60) {
  console.log(`🔄 Starting continuous monitoring every ${intervalSeconds} seconds...`);
  console.log('Press Ctrl+C to stop\n');
  
  const timer = startContinuousMonitoring({
    interval: intervalSeconds * 1000,
    printToConsole: true,
    saveReports: true,
    saveSummary: true,
    enableTrends: true
  });

  // Stop after 5 minutes for demo purposes
  setTimeout(() => {
    stopContinuousMonitoring(timer);
    console.log('📝 Demo monitoring stopped after 5 minutes');
    console.log('Check the "reports" folder for saved data!');
  }, 5 * 60 * 1000);

  return timer;
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateRealtimeFeatures().catch(console.error);
}