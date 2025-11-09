// moved from src/availability.ts
export interface AvailabilityInput {
  sla: number; // e.g. 99.9
}

export interface AvailabilityResult {
  downtimePerMonthMinutes: number;
  downtimePerYearHours: number;
}

export function availabilityMetrics(
  input: AvailabilityInput
): AvailabilityResult {
  const downtimeFraction = 1 - input.sla / 100;
  const downtimePerMonthMinutes = downtimeFraction * 30 * 24 * 60;
  const downtimePerYearHours = downtimeFraction * 365 * 24;
  return { downtimePerMonthMinutes, downtimePerYearHours };
}