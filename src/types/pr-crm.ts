export type UserRole = 'director' | 'press_officer' | 'junior' | 'viewer';
export type RequestUrgency = 'baixa' | 'media' | 'alta' | 'urgente_crise';
export type RequestStatus = 'pendente_analise' | 'aguarda_porta_voz' | 'rascunho_aprovacao' | 'concluido' | 'recusado';
export type MediaTier = 'tier_1' | 'tier_2' | 'tier_3' | 'influencer_especializado';
export type SentimentType = 'muito_positivo' | 'positivo' | 'neutro' | 'negativo' | 'critico';
export type CoverageType = 'online' | 'imprensa_escrita' | 'televisao' | 'radio' | 'podcast' | 'agencia';
export type TaskPriority = 'alta' | 'media' | 'baixa' | 'urgente' | 'normal';
export type TaskStatus = 'por_fazer' | 'em_curso' | 'concluida' | 'pending' | 'in_progress' | 'review' | 'completed';
export type TaskType = 'contacto_jornalista' | 'redacao' | 'reuniao' | 'aprovacao_cliente' | 'outra';

export type ProjectType = 'lancamento' | 'evento' | 'comunicado' | 'entrevista' | 'campanha' | 'crise';
export type ProjectStatus = 'em_preparacao' | 'em_curso' | 'aguarda_aprovacao' | 'concluido' | 'em_pausa' | 'open' | 'completed' | 'archived';
export type ProjectPriority = 'alta' | 'media' | 'baixa';

export interface ProjectDocumentLink {
  id?: string;
  label: string;
  url: string;
  type?: 'briefing' | 'comunicado' | 'pasta' | 'outro';
}
export type ContactType = 'chamada' | 'email' | 'whatsapp' | 'reuniao';
export type ContactStatus = 'respondeu' | 'sem_resposta' | 'enviado' | 'agendado';

// Enums para OCS e Jornalistas
export type OutletScope = 'nacional' | 'regional' | 'local';
export type OutletPeriodicity = 'diario' | 'semanal' | 'mensal' | 'continua' | 'outra';
export type OutletFormat = 'online' | 'papel' | 'radio' | 'tv' | 'podcast' | 'agencia_noticiosa';
export type OutletStatus = 'ativo' | 'extinto';

export type ContactPreference = 'email' | 'telefone' | 'whatsapp';
export type JournalistStatus = 'ativo' | 'mudou_de_meio' | 'reformado';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  project_id?: string;
  project_name: string;
  client?: string;
  client_or_brand?: string;
  type: TaskType;
  journalist_id?: string;
  journalist_name?: string;
  responsible: string;
  assignee_name?: string;
  assignee_id?: string;
  priority: TaskPriority;
  due_date: string;
  due_time?: string;
  status: TaskStatus;
  description?: string;
  notes?: string;
  is_overdue?: boolean;
  subtasks?: SubtaskItem[];
  comments?: TaskComment[];
  audit_log?: string[];
  created_at?: string;
  completed_at?: string;
  updated_at?: string;
}

export interface TargetJournalist {
  id?: string;
  name: string;
  outlet: string;
  role?: string;
  status?: 'por_contactar' | 'contactado' | 'respondeu' | 'publicou';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  client_or_brand: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  deadline: string;
  responsible: string;
  manager_name?: string;
  manager_id?: string;
  team: string[];
  team_members?: string[];
  objective: string;
  description?: string;
  target_journalist_ids?: string[];
  target_journalists?: TargetJournalist[] | string[];
  target_outlets?: string[];
  links_documents?: ProjectDocumentLink[];
  notes?: string;
  progress?: number;
  is_overdue?: boolean;
  budget_eur?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyContact {
  id: string;
  contact_name: string;
  journalist_id?: string;
  outlet_name?: string;
  contact_type: ContactType;
  status: ContactStatus;
  subject_or_notes?: string;
  contact_date: string;
  contact_time?: string;
  project_id?: string;
  user_id?: string;
  created_at?: string;
}

export interface MediaSocialLinks {
  twitter_x?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface MediaOutlet {
  id: string;
  name: string;
  logo_url?: string;
  media_group?: string;
  group_id?: string;
  address?: string;
  website_url?: string;
  agenda_email?: string;
  contact_email?: string;
  phone?: string;
  social_links?: MediaSocialLinks;
  erc_type?: string;
  erc_registration?: string;
  specialties?: string[];
  formats?: OutletFormat[];
  scope?: OutletScope;
  periodicity?: OutletPeriodicity;
  estimated_audience?: number;
  status: OutletStatus;
  created_at?: string;
  updated_at?: string;
}

export interface JournalistSocialLinks {
  linkedin?: string;
  twitter_x?: string;
  author_page?: string;
}

export interface Journalist {
  id: string;
  name: string;
  role_title?: string;
  outlet_ids?: string[];
  outlet_names?: string[];
  outlet_name: string;
  emails: string[];
  phones: string[];
  contact_preference: ContactPreference;
  links?: JournalistSocialLinks;
  intervention_areas: string[];
  status: JournalistStatus;
  last_contact_date?: string;
  days_inactive?: number;
  contact_origin?: string;
  rgpd_consent: boolean;
  rgpd_consent_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Clipping {
  id: string;
  title: string;
  outlet: string;
  outlet_id?: string;
  journalist_name?: string;
  journalist_id?: string;
  coverage_type: CoverageType;
  media_tier: MediaTier;
  sentiment: SentimentType;
  published_at: string;
  reach_impressions: number;
  ave_value_eur: number;
  url?: string;
  summary: string;
  project_id?: string;
  created_at?: string;
}

export interface PRDashboardMetrics {
  openProjectsCount: number;
  tasksTodayCount: number;
  tasksHighToday: number;
  tasksOverdueCount: number;
  tasksWeekCount: number;
  contactsTodayCount: number;
  contactsWeekCount: number;
  clippingsMonthCount: number;
  positiveClippingsCount: number;
  neutralClippingsCount: number;
  negativeClippingsCount: number;
  responseRatePercent: number;
  totalAveValueEur: number;
  totalReachImpressions: number;
}
