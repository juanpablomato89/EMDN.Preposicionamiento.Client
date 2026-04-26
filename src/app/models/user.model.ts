export interface User {
  id: string;
  email?: string;
  name?: string;
  lastName?: string;
  organismoId?: number;
  organismo?: string;
  role?: string;
  isLockedOut: boolean;
  isUserDomain: boolean;
  creado: string;
  modificado: string;
}

export interface UserCreate {
  email: string;
  name: string;
  lastName: string;
  password: string;
  organismoId?: number;
  role: string;
}

export interface UserUpdate {
  name?: string;
  lastName?: string;
  organismoId?: number;
  role?: string;
}

export interface UserFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  organismoId?: number;
  onlyLocked?: boolean;
}
