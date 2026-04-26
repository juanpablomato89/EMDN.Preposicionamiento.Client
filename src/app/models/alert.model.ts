export enum AlertEventType {
  FailedLoginThreshold = 1,
  NewAdminCreated = 2,
  RoleDeleted = 3,
  MultipleSessionsRevoked = 4,
  LdapConfigChanged = 5,
}

export interface AlertEventTypeInfo {
  value: AlertEventType;
  name: string;
  requiresThreshold: boolean;
}

export interface AlertRule {
  id: number;
  name: string;
  description?: string;
  eventType: AlertEventType;
  eventTypeName: string;
  threshold?: number | null;
  windowMinutes?: number | null;
  enabled: boolean;
  notifyEmails: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AlertRuleCreate {
  name: string;
  description?: string;
  eventType: AlertEventType;
  threshold?: number | null;
  windowMinutes?: number | null;
  enabled: boolean;
  notifyEmails: string[];
}

export interface AlertNotification {
  id: number;
  alertRuleId: number;
  alertRuleName: string;
  triggeredAt: string;
  payload: string;
  sent: boolean;
  sentAt?: string;
  error?: string;
}
