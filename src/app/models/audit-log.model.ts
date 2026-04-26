export interface AuditLog {
  id: number;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

export interface AuditFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  action?: string;
  userId?: string;
  from?: string;
  to?: string;
  success?: boolean;
}
