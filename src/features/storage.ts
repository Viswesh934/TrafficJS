// moved from src/storage.ts
export interface StorageInput {
  dailyDataGB: number;
  retentionDays: number;
  replicationFactor?: number;
}

export interface StorageResult {
  totalStorageGB: number;
}

export function storageMetrics(input: StorageInput): StorageResult {
  const replication = input.replicationFactor ?? 3;
  const totalStorageGB = input.dailyDataGB * input.retentionDays * replication;
  return { totalStorageGB };
}