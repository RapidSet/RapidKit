import type { LucideIcon } from 'lucide-react';
import type { Role } from '../../services/access';

export type RoleSwitcherProps = Readonly<{
  role: Role;
  onChange: (role: Role) => void;
}>;

export type RoleOption = Readonly<{
  role: Role;
  label: string;
  icon: LucideIcon;
}>;
