export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireNonAlphanumeric: boolean;
  maxFailedAttempts: number;
  lockoutMinutes: number;
  passwordExpirationDays: number;
  preventReuseLastN: number;
  updatedAt: string;
  updatedByUserId?: string;
  updatedByEmail?: string;
}

export interface PasswordPolicyUpdate {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireNonAlphanumeric: boolean;
  maxFailedAttempts: number;
  lockoutMinutes: number;
  passwordExpirationDays: number;
  preventReuseLastN: number;
}
