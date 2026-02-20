export type RuleConditionSource = 'weather' | 'solar';

export type RuleConditionParameter =
  | 'temperature'
  | 'pressure'
  | 'humidity'
  | 'uvIndex'
  | 'kpIndex'
  | 'aIndex';

export type OperatorEnum = 'gt' | 'lt' | 'eq' | 'gte' | 'lte';

export interface RuleCondition {
  source: RuleConditionSource;
  parameter: RuleConditionParameter;
  operator: OperatorEnum;
  value: number;
}

export interface PredictionRule {
  _id: string; // MongoDB ObjectId string
  userId: string;
  name: string;
  isEnabled: boolean;
  conditions: RuleCondition[];
  alertMessage: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface CreatePredictionRulePayload {
  name: string;
  conditions: RuleCondition[];
  alertMessage: string;
  isEnabled?: boolean; // Defaults to true if not provided
}

export type UpdatePredictionRulePayload = Partial<CreatePredictionRulePayload>;

export interface RiskForecastQuery {
  latitude?: number;
  longitude?: number;
  weights?: {
    weather: number;
    solar: number;
    history: number;
  };
}

export interface RiskForecastResponse {
  dailyRisk: number; // 0-100 score for the day
  hourlyRisk: {
    time: string; // ISO Date string
    risk: number; // 0-100 score for the hour
  }[];
  factors: {
    weather: {
      temperature: number;
      pressure: number;
      humidity: number;
      uvIndex: number;
    };
    solar: {
      kpIndex?: number;
      aIndex?: number;
    };
    history: {
      lastIncidentDate?: string; // ISO Date string of last migraine incident
    };
  };
}

export type NotificationTypeEnum = 'risk-alert' | 'system' | 'pattern-match';

export interface NotificationResponse {
  _id: string; // Notification ID
  userId: string; // User ID
  type: NotificationTypeEnum;
  message: string; // Notification text
  isRead: boolean; // Whether the notification has been read
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  ruleId?: string; // ID of the triggered prediction rule (if applicable)
  incidentId?: string; // ID of associated incident (if applicable)
}
