export interface Session {
  id: number;
  userId: string;
  userEmail?: string;
  userName?: string;
  userLastName?: string;
  createdAt: string;
  expiresAt: string;
  isRevoked: boolean;
  isExpired: boolean;
  isActive: boolean;
}

export interface SessionFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  userId?: string;
  onlyActive?: boolean;
}
