// moved from src/example.ts
import { trafficMetrics } from '@/features/traffic';
import { storageMetrics } from '@/features/storage';
import { costEstimate } from '@/features/cost';
import { availabilityMetrics } from '@/features/availability';

const traffic = trafficMetrics({ users: 1_000_000, reqPerUserPerDay: 100, payloadKB: 2 })
console.log(traffic)
// { rps: 1157.407..., dailyDataGB: 200 }

const storage = storageMetrics({ dailyDataGB: traffic.dailyDataGB, retentionDays: 30 })
console.log(storage)
// { totalStorageGB: 18000 }

const cost = costEstimate({
  storageGB: storage.totalStorageGB,
  storageCostPerGB: 0.023,
  servers: 10,
  serverCostPerMonth: 30
})
console.log(cost)
// { monthlyCost: ~414.4 }

const availability = availabilityMetrics({ sla: 99.9 })
console.log(availability)
// { downtimePerMonthMinutes: 43.2, downtimePerYearHours: 8.76 }
