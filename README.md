
---

# 🚦 TrafficJS

**TrafficJS** is a TypeScript toolkit and server for system architecture, traffic analysis, storage, cost estimation, and real-time metrics monitoring.

---

## 📦 Installation

```bash
npm install trafficjs
```

---

## Usage

### 1. As a Library

Import and use calculation functions in your app:

```typescript
import { trafficMetrics } from 'trafficjs';
import { storageMetrics } from 'trafficjs';
import { costEstimate } from 'trafficjs';
import { availabilityMetrics } from 'trafficjs';

const traffic = trafficMetrics({ users: 100000, reqPerUserPerDay: 100, payloadKB: 2 });
const storage = storageMetrics({ dailyDataGB: traffic.dailyDataGB, retentionDays: 30 });
const cost = costEstimate({ storageGB: storage.totalStorageGB, storageCostPerGB: 0.023, servers: 10, serverCostPerMonth: 30 });
const availability = availabilityMetrics({ sla: 99.9 });
```

### 2. As a Server (Metrics Exporter)

Run the built-in Express server to expose system metrics via HTTP endpoints:

```bash
npm run dev
# or
npx tsx src/server.ts
```

Endpoints:
- `/metrics` — JSON system metrics
- `/metrics/traffic` — Prometheus/traffic-compatible metrics
- `/trends` — Trend tracking
- `/health` — Health check

Set the port with the `PORT` environment variable:

```bash
$env:PORT=8080; npm run dev   # Windows PowerShell
PORT=8080 npm run dev         # Bash
```

---

## Scripts

- `npm run dev` — Start the metrics server
- `npm run example` — Run usage example
- `npm run demo` — Run real-time demo
- `npm run monitor` — Run monitor loop

---

## Project Structure

```
TrafficJS/
├── src/
│   ├── features/         # Core calculation modules (traffic, storage, cost, availability, etc.)
│   ├── core/             # Real-time system metrics and monitor
│   ├── exporter/         # HTTP metrics exporter modules
│   ├── demo/             # Example/demo scripts
│   ├── server.ts         # Main Express server entry point
│   └── index.ts          # Main library entry point (for npm)
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Reference

### `trafficMetrics(input: TrafficInput): TrafficResult`

Calculate requests per second and daily data volume.

**Parameters:**
```typescript
interface TrafficInput {
  users: number;              // Daily active users
  reqPerUserPerDay: number;   // Requests per user per day
  payloadKB: number;          // Average request size in KB
}
```

**Returns:**
```typescript
interface TrafficResult {
  rps: number;                // Requests per second
  dailyDataGB: number;        // Daily data volume in GB
}
```

### `storageMetrics(input: StorageInput): StorageResult`

Calculate total storage requirements with replication.

**Parameters:**
```typescript
interface StorageInput {
  dailyDataGB: number;        // Daily data volume in GB
  retentionDays: number;      // Data retention period in days
  replicationFactor?: number; // Replication factor (default: 3)
}
```

**Returns:**
```typescript
interface StorageResult {
  totalStorageGB: number;     // Total storage needed in GB
}
```

### `costEstimate(input: CostInput): CostResult`

Calculate monthly infrastructure costs.

**Parameters:**
```typescript
interface CostInput {
  storageGB: number;          // Storage in GB
  storageCostPerGB: number;   // Cost per GB of storage
  servers: number;            // Number of servers
  serverCostPerMonth: number; // Monthly cost per server
}
```

**Returns:**
```typescript
interface CostResult {
  monthlyCost: number;        // Total monthly cost
}
```

### `availabilityMetrics(input: AvailabilityInput): AvailabilityResult`

Calculate downtime based on SLA.

**Parameters:**
```typescript
interface AvailabilityInput {
  sla: number;                // SLA percentage (e.g., 99.9)
}
```

**Returns:**
```typescript
interface AvailabilityResult {
  downtimePerMonthMinutes: number; // Monthly downtime in minutes
  downtimePerYearHours: number;    // Yearly downtime in hours
}
```

---

## 📋 Usage Examples

### E-commerce Platform Planning

```typescript
import { trafficMetrics, storageMetrics, costEstimate } from 'trafficjs';

// Black Friday traffic spike
const peakTraffic = trafficMetrics({
  users: 5_000_000,
  reqPerUserPerDay: 200,
  payloadKB: 5
});

console.log(`Peak RPS: ${peakTraffic.rps.toFixed(0)}`);
// → Peak RPS: 11574

// Storage for 6 months of data
const storage = storageMetrics({
  dailyDataGB: peakTraffic.dailyDataGB,
  retentionDays: 180,
  replicationFactor: 3
});

// AWS-like pricing
const cost = costEstimate({
  storageGB: storage.totalStorageGB,
  storageCostPerGB: 0.023,
  servers: 50,
  serverCostPerMonth: 100
});

console.log(`Monthly cost: $${cost.monthlyCost.toLocaleString()}`);
```

### Microservice Architecture

```typescript
import { trafficMetrics, availabilityMetrics } from 'trafficjs';

// API Gateway traffic
const apiTraffic = trafficMetrics({
  users: 100_000,
  reqPerUserPerDay: 50,
  payloadKB: 1
});

// Service availability requirements
const availability = availabilityMetrics({ sla: 99.99 });

console.log(`API RPS: ${apiTraffic.rps.toFixed(2)}`);
console.log(`Allowed downtime: ${availability.downtimePerMonthMinutes.toFixed(1)} min/month`);
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/Viswesh934/TrafficJS.git
cd TrafficJS

# Install dependencies
npm install

# Run the server
npm run dev

# Run example/demo scripts
npm run example
npm run demo
npm run monitor
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License — see the LICENSE file for details.

---

## 🔗 Links

- [GitHub Repository](https://github.com/Viswesh934/TrafficJS)
- [npm Package](https://www.npmjs.com/package/trafficjs)
- [Issues](https://github.com/Viswesh934/TrafficJS/issues)

---

## 📊 Use Cases

- **System Architecture Planning**: Estimate infrastructure requirements for new projects
- **Capacity Planning**: Calculate scaling requirements for growing applications
- **Cost Optimization**: Analyze and optimize infrastructure spending
- **SLA Planning**: Understand availability requirements and downtime implications
- **Performance Benchmarking**: Establish baseline metrics for system performance

---

Made with 🔥 by [Viswesh934](https://github.com/Viswesh934)

---