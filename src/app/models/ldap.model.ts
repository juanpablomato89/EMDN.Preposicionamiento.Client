export interface LdapConfiguration {
  enabled: boolean;
  host: string;
  port: number;
  useSsl: boolean;
  baseDn: string;
  bindDn: string;
  hasPassword: boolean;
  userSearchFilter: string;
  emailAttribute: string;
  nameAttribute: string;
  lastNameAttribute: string;
  defaultRole: string;
  updatedAt: string;
  updatedByUserId?: string;
  updatedByEmail?: string;
}

export interface LdapConfigurationUpdate {
  enabled: boolean;
  host: string;
  port: number;
  useSsl: boolean;
  baseDn: string;
  bindDn: string;
  bindPassword?: string | null;
  userSearchFilter: string;
  emailAttribute: string;
  nameAttribute: string;
  lastNameAttribute: string;
  defaultRole: string;
}

export interface LdapTestRequest {
  useStored: boolean;
  host?: string;
  port?: number;
  useSsl?: boolean;
  bindDn?: string;
  bindPassword?: string;
  sampleUsername?: string;
}

export interface LdapTestResult {
  success: boolean;
  message: string;
  sampleUser?: Record<string, string>;
}
