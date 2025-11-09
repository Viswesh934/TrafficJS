import express from "express";
import { getRealtimeMetrics } from "@/core/realtime";
import { calculateLoadScore } from "@/features/loadScore";
import { checkAlerts } from "@/features/alerts";
import { getHistory, getTrend } from "@/features/trends";

const port = process.env.PORT ? Number(process.env.PORT) : 9090;
const app = express();

// Enable CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Basic metrics endpoint
app.get('/metrics', async (_, res) => {
	try {
		const stats = await getRealtimeMetrics();
		const loadScore = calculateLoadScore(stats);
		const alerts = checkAlerts({ ...stats, loadScore });
		res.json({
			timestamp: new Date().toISOString(),
			metrics: stats,
			loadScore: parseFloat(loadScore),
			alerts: alerts.map(a => ({
				level: a.level,
				message: a.message,
				emoji: a.emoji
			}))
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to get metrics', message: error instanceof Error ? error.message : 'Unknown error' });
	}
});

// Health check endpoint
app.get('/health', (_, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		service: 'TrafficJS Metrics Exporter'
	});
});

// Trends endpoint
app.get('/trends', (_, res) => {
	try {
		const history = getHistory();
		const cpuTrend = getTrend('cpu');
		const memoryTrend = getTrend('memoryUsedGB');
		const loadTrend = getTrend('loadScore');
		res.json({
			timestamp: new Date().toISOString(),
			history: history.slice(-20),
			trends: {
				cpu: cpuTrend,
				memory: memoryTrend,
				loadScore: loadTrend
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to get trends', message: error instanceof Error ? error.message : 'Unknown error' });
	}
});

// Traffic-compatible metrics endpoint
app.get('/metrics/traffic', async (_, res) => {
	try {
		const stats = await getRealtimeMetrics();
		const loadScore = calculateLoadScore(stats);
		const trafficMetrics = `
# HELP cpu_usage_percent Current CPU usage percentage
# TYPE cpu_usage_percent gauge
cpu_usage_percent ${stats.cpu}

# HELP memory_used_bytes Memory currently used in bytes
# TYPE memory_used_bytes gauge
memory_used_bytes ${parseFloat(stats.memoryUsedGB) * 1e9}

# HELP memory_total_bytes Total memory available in bytes
# TYPE memory_total_bytes gauge
memory_total_bytes ${parseFloat(stats.memoryTotalGB) * 1e9}

# HELP disk_used_bytes Disk space currently used in bytes
# TYPE disk_used_bytes gauge
disk_used_bytes ${parseFloat(stats.diskUsedGB) * 1e9}

# HELP disk_total_bytes Total disk space available in bytes
# TYPE disk_total_bytes gauge
disk_total_bytes ${parseFloat(stats.diskTotalGB) * 1e9}

# HELP network_rx_bytes_per_second Network receive rate in bytes per second
# TYPE network_rx_bytes_per_second gauge
network_rx_bytes_per_second ${parseFloat(stats.netRxMBps) * 1e6}

# HELP network_tx_bytes_per_second Network transmit rate in bytes per second
# TYPE network_tx_bytes_per_second gauge
network_tx_bytes_per_second ${parseFloat(stats.netTxMBps) * 1e6}

# HELP system_load_score Overall system load score (0-100)
# TYPE system_load_score gauge
system_load_score ${loadScore}
`;
		res.set('Content-Type', 'text/plain');
		res.send(trafficMetrics.trim());
	} catch (error) {
		res.status(500).send(`# Error getting metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
});

app.listen(port, () => {
	console.log("Starting TrafficJS Metrics Exporter...");
	console.log(`📊 TrafficJS Metrics Exporter running on port ${port}`);
	console.log(`🔗 Endpoints:`);
	console.log(`   📈 JSON Metrics: http://localhost:${port}/metrics`);
	console.log(`   🏥 Health Check: http://localhost:${port}/health`);
	console.log(`   📊 Trends: http://localhost:${port}/trends`);
	console.log(`   🎯 Traffic: http://localhost:${port}/metrics/traffic`);
});
