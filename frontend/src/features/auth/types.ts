export interface Role {
  id: number;
  title: string;
  description?: string | null;
  permissions?: Record<string, string[]>;
}

export interface Subdivision {
  id: number;
  title: string;
}

export interface RoleConfig {
  config_id: number;
  subdivision?: Subdivision | null;
  role: Role;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  photo_link?: string | null;
  yandex_id?: string | null;
  phone?: string | null;
  roles: RoleConfig[];
  current_role?: RoleConfig | null;
}
