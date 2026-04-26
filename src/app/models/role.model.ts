export interface Role {
  id: string;
  name: string;
  usersCount: number;
  isSystem: boolean;
}

export interface RoleCreate {
  name: string;
}

export interface RoleUpdate {
  name: string;
}
