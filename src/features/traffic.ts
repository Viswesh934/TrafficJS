// moved from src/traffic.ts
export interface TrafficInput {
  users: number; // daily active users
  reqPerUserPerDay: number; // requests per user per day
  payloadKB: number; // average request size in KB
}

export interface TrafficResult {
  rps: number;
  dailyDataGB: number;
}

export function trafficMetrics(input: TrafficInput): TrafficResult {
  const rps = (input.users * input.reqPerUserPerDay) / 86400;
  const dailyDataGB =
    (input.users * input.reqPerUserPerDay * input.payloadKB) / 1e6;
  return { rps, dailyDataGB };
}
