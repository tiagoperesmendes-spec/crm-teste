export type UserRole = 'director' | 'press_officer' | 'junior' | 'viewer';

export interface RolePermissions {
  roleKey: UserRole;
  label: string;
  fullTitle: string;
  tag: string;
  badgeClass: string;
  dotColor: string;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canCreateContacts: boolean;
  canManageJournalists: boolean;
  canDeleteJournalists: boolean;
  canManageOutlets: boolean;
  canDeleteOutlets: boolean;
  canManageClipping: boolean;
  canConfigDatabase: boolean;
  isReadOnly: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  director: {
    roleKey: 'director',
    label: 'Geral',
    fullTitle: 'Diretor(a) de Comunicação',
    tag: 'Acesso Total',
    badgeClass: 'bg-[#E6C5CA]/45 text-[#6C1C37] border-[#E6C5CA]',
    dotColor: 'bg-[#6C1C37]',
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canCreateContacts: true,
    canManageJournalists: true,
    canDeleteJournalists: true,
    canManageOutlets: true,
    canDeleteOutlets: true,
    canManageClipping: true,
    canConfigDatabase: true,
    isReadOnly: false,
  },
  press_officer: {
    roleKey: 'press_officer',
    label: 'Técnico de Comunicação',
    fullTitle: 'Técnico(a) de Comunicação',
    tag: 'Adiciona & Conclui',
    badgeClass: 'bg-[#DFE7D6] text-[#3F5A2E] border-[#DFE7D6]',
    dotColor: 'bg-[#3F5A2E]',
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canCreateContacts: true,
    canManageJournalists: true,
    canDeleteJournalists: false,
    canManageOutlets: true,
    canDeleteOutlets: false,
    canManageClipping: true,
    canConfigDatabase: false,
    isReadOnly: false,
  },
  junior: {
    roleKey: 'junior',
    label: 'Técnico de Comunicação',
    fullTitle: 'Técnico(a) de Comunicação',
    tag: 'Adiciona & Conclui',
    badgeClass: 'bg-[#DDE6EE] text-[#2F4A63] border-[#DDE6EE]',
    dotColor: 'bg-[#2F4A63]',
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canCreateContacts: true,
    canManageJournalists: true,
    canDeleteJournalists: false,
    canManageOutlets: true,
    canDeleteOutlets: false,
    canManageClipping: true,
    canConfigDatabase: false,
    isReadOnly: false,
  },
  viewer: {
    roleKey: 'viewer',
    label: 'Visualização',
    fullTitle: 'Visualização (Apenas Leitura)',
    tag: 'Apenas Leitura',
    badgeClass: 'bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]',
    dotColor: 'bg-[#5C554E]',
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canCreateContacts: false,
    canManageJournalists: false,
    canDeleteJournalists: false,
    canManageOutlets: false,
    canDeleteOutlets: false,
    canManageClipping: false,
    canConfigDatabase: false,
    isReadOnly: true,
  },
};

export const AUTHORIZED_ACCOUNTS = {
  'tiagoperesmendes@gmail.com': {
    name: 'Tiago Mendes',
    role: 'director' as UserRole,
    title: 'Diretor(a) de Comunicação',
    password: 'Direcao2026!'
  },
  'leonor.rp.faculdade@gmail.com': {
    name: 'Leonor Rodrigues',
    role: 'press_officer' as UserRole,
    title: 'Técnico(a) de Comunicação',
    password: 'Modo2026!'
  },
  'tiagoperesmendesps4@gmail.com': {
    name: 'Tiago Mendes (Convidado)',
    role: 'viewer' as UserRole,
    title: 'Visualização (Apenas Leitura)',
    password: 'Convidado2026!'
  }
};

export function getRolePermissions(role: string | null | undefined): RolePermissions {
  if (!role || !(role in ROLE_PERMISSIONS)) {
    return ROLE_PERMISSIONS.director;
  }
  return ROLE_PERMISSIONS[role as UserRole];
}
