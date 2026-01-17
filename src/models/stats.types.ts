import { IncidentTypeEnum } from '../enums/incident-type.enum';
import { TriggerTypeEnum } from '../enums/trigger-type.enum';

export interface IncidentStats {
  byType: Record<IncidentTypeEnum, number>;
  byTrigger: Record<TriggerTypeEnum, number>;
  byTime: {
    dailyCounts: Record<string, number>; // Key is date string "YYYY-MM-DD"
    totalDurationHours: number;
    averageDurationHours: number;
    totalIncidents: number;
  };
}
