// moved from src/cost.ts
export interface CostInput {
  storageGB: number;
  storageCostPerGB: number;
  servers: number;
  serverCostPerMonth: number;
}

export interface CostResult {
  monthlyCost: number;
}

export function costEstimate(input: CostInput): CostResult {
  const { storageGB, storageCostPerGB, servers, serverCostPerMonth } = input;
  const storageCost = storageGB * storageCostPerGB;
  const computeCost = servers * serverCostPerMonth;
  const monthlyCost = storageCost + computeCost;
  return { monthlyCost };
}
