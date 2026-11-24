-- ==============================================================================
-- REPUTATION OS • MASTER SCHEMA & PRODUCTION ROW LEVEL SECURITY (RLS)
-- Gabinete de Comunicação & CRM de Relações Públicas
-- Arquitetura: Next.js + Supabase + Vercel
-- ==============================================================================

-- 1. CRIAÇÃO DE EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRIAÇÃO DE TIPOS ENUM
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('director', 'press_officer', 'junior', 'viewer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('urgente', 'alta', 'normal', 'baixa');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'review', 'completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('open', 'completed', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_type') THEN
        CREATE TYPE contact_type AS ENUM ('chamada', 'email', 'whatsapp', 'reuniao');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_status') THEN
        CREATE TYPE contact_status AS ENUM ('respondeu', 'sem_resposta', 'enviado', 'agendado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sentiment_type') THEN
        CREATE TYPE sentiment_type AS ENUM ('muito_positivo', 'positivo', 'neutro', 'negativo', 'critico');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coverage_type') THEN
        CREATE TYPE coverage_type AS ENUM ('online', 'imprensa_escrita', 'televisao', 'radio', 'podcast');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_tier') THEN
        CREATE TYPE media_tier AS ENUM ('tier_1', 'tier_2', 'tier_3', 'influencer_especializado');
    END IF;
END $$;

-- 3. TABELA DE PERFIS DE UTILIZADOR (LIGADA AO AUTH.USERS)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'press_officer' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para sincronizar novos utilizadores de auth.users para profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'press_officer'::user_role)
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. TABELA DE ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS)
CREATE TABLE IF NOT EXISTS media_outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    media_group VARCHAR(255),
    website_url TEXT,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    erc_registration VARCHAR(100),
    specialty VARCHAR(150),
    formats TEXT[] DEFAULT ARRAY['Online']::TEXT[],
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE JORNALISTAS (CRM)
CREATE TABLE IF NOT EXISTS journalists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    outlet_id UUID REFERENCES media_outlets(id) ON DELETE SET NULL,
    outlet_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(150) DEFAULT 'Jornalista',
    intervention_area VARCHAR(150),
    links TEXT,
    registration_date DATE DEFAULT CURRENT_DATE NOT NULL,
    last_contact_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE PROJETOS (DOSSIÊS DE COMUNICAÇÃO)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    client_or_brand VARCHAR(255) DEFAULT 'Institucional' NOT NULL,
    status project_status DEFAULT 'open' NOT NULL,
    deadline DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    manager_name VARCHAR(255) DEFAULT 'Leonor Rodrigues',
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    team_members TEXT[] DEFAULT ARRAY['Leonor Rodrigues', 'Sofia Ramos']::TEXT[],
    description TEXT,
    budget_eur NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA DE TAREFAS ("O QUE TENHO PARA FAZER")
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    project_name VARCHAR(255) DEFAULT 'Geral',
    priority task_priority DEFAULT 'normal' NOT NULL,
    due_date DATE NOT NULL,
    due_time VARCHAR(10) DEFAULT '18:00',
    status task_status DEFAULT 'pending' NOT NULL,
    assignee_name VARCHAR(255) DEFAULT 'Leonor Rodrigues',
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    client_or_brand VARCHAR(255),
    description TEXT,
    subtasks JSONB DEFAULT '[]'::JSONB,
    comments JSONB DEFAULT '[]'::JSONB,
    audit_log JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABELA DE CONTACTOS DIÁRIOS
CREATE TABLE IF NOT EXISTS daily_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name VARCHAR(255) NOT NULL,
    journalist_id UUID REFERENCES journalists(id) ON DELETE SET NULL,
    outlet_name VARCHAR(255),
    contact_type contact_type DEFAULT 'chamada' NOT NULL,
    status contact_status DEFAULT 'respondeu' NOT NULL,
    subject_or_notes TEXT,
    contact_date DATE DEFAULT CURRENT_DATE NOT NULL,
    contact_time VARCHAR(10) DEFAULT '11:00',
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para atualizar automaticamente last_contact_date no jornalista
CREATE OR REPLACE FUNCTION public.update_journalist_last_contact()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.journalist_id IS NOT NULL THEN
        UPDATE public.journalists
        SET last_contact_date = NEW.contact_date,
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.journalist_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_daily_contact_logged ON daily_contacts;
CREATE TRIGGER on_daily_contact_logged
    AFTER INSERT OR UPDATE ON daily_contacts
    FOR EACH ROW EXECUTE FUNCTION public.update_journalist_last_contact();

-- 9. TABELA DE CLIPPINGS (COBERTURA MEDIÁTICA & AVE)
CREATE TABLE IF NOT EXISTS clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    outlet VARCHAR(255) NOT NULL,
    outlet_id UUID REFERENCES media_outlets(id) ON DELETE SET NULL,
    journalist_name VARCHAR(255),
    journalist_id UUID REFERENCES journalists(id) ON DELETE SET NULL,
    coverage_type coverage_type DEFAULT 'online' NOT NULL,
    media_tier media_tier DEFAULT 'tier_1' NOT NULL,
    sentiment sentiment_type DEFAULT 'positivo' NOT NULL,
    published_at DATE DEFAULT CURRENT_DATE NOT NULL,
    reach_impressions BIGINT DEFAULT 0,
    ave_value_eur NUMERIC(12, 2) DEFAULT 0.00,
    url TEXT,
    summary TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 10. SEGURANÇA AVANÇADA: ROW LEVEL SECURITY (RLS) & POLÍTICAS RBAC
-- ==============================================================================

-- Ativação de RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clippings ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para extrair a role do utilizador atual
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- A. Políticas para PROFILES
DROP POLICY IF EXISTS "Perfis visíveis para utilizadores autenticados" ON profiles;
CREATE POLICY "Perfis visíveis para utilizadores autenticados" ON profiles
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Utilizador atualiza o próprio perfil ou Diretor" ON profiles;
CREATE POLICY "Utilizador atualiza o próprio perfil ou Diretor" ON profiles
    FOR UPDATE TO authenticated USING (
        auth.uid() = id OR public.current_user_role() = 'director'
    );

-- B. Políticas para TAREFAS (TASKS)
DROP POLICY IF EXISTS "Leitura de tarefas por qualquer utilizador autenticado" ON tasks;
CREATE POLICY "Leitura de tarefas por qualquer utilizador autenticado" ON tasks
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Criação de tarefas por Diretor e Assessor" ON tasks;
CREATE POLICY "Criação de tarefas por Diretor e Assessor" ON tasks
    FOR INSERT TO authenticated WITH CHECK (
        public.current_user_role() IN ('director', 'press_officer')
    );

DROP POLICY IF EXISTS "Edição de tarefas por Diretor e Assessor" ON tasks;
CREATE POLICY "Edição de tarefas por Diretor e Assessor" ON tasks
    FOR UPDATE TO authenticated USING (
        public.current_user_role() IN ('director', 'press_officer')
    );

DROP POLICY IF EXISTS "Eliminação de tarefas exclusiva de Diretor" ON tasks;
CREATE POLICY "Eliminação de tarefas exclusiva de Diretor" ON tasks
    FOR DELETE TO authenticated USING (
        public.current_user_role() = 'director'
    );

-- C. Políticas para PROJETOS (PROJECTS)
DROP POLICY IF EXISTS "Leitura de projetos por qualquer utilizador autenticado" ON projects;
CREATE POLICY "Leitura de projetos por qualquer utilizador autenticado" ON projects
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Gestão de projetos exclusiva de Diretor" ON projects;
CREATE POLICY "Gestão de projetos exclusiva de Diretor" ON projects
    FOR ALL TO authenticated USING (
        public.current_user_role() = 'director'
    );

-- D. Políticas para CONTACTOS DIÁRIOS (DAILY_CONTACTS)
DROP POLICY IF EXISTS "Leitura de contactos por qualquer utilizador autenticado" ON daily_contacts;
CREATE POLICY "Leitura de contactos por qualquer utilizador autenticado" ON daily_contacts
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Registo de contactos por Diretor, Assessor e Técnico" ON daily_contacts;
CREATE POLICY "Registo de contactos por Diretor, Assessor e Técnico" ON daily_contacts
    FOR INSERT TO authenticated WITH CHECK (
        public.current_user_role() IN ('director', 'press_officer', 'junior')
    );

DROP POLICY IF EXISTS "Edição de contactos por Diretor e Assessor" ON daily_contacts;
CREATE POLICY "Edição de contactos por Diretor e Assessor" ON daily_contacts
    FOR UPDATE TO authenticated USING (
        public.current_user_role() IN ('director', 'press_officer')
    );

DROP POLICY IF EXISTS "Eliminação de contactos exclusiva de Diretor" ON daily_contacts;
CREATE POLICY "Eliminação de contactos exclusiva de Diretor" ON daily_contacts
    FOR DELETE TO authenticated USING (
        public.current_user_role() = 'director'
    );

-- E. Políticas para JORNALISTAS & OCS
DROP POLICY IF EXISTS "Leitura de jornalistas e OCS para todos" ON journalists;
CREATE POLICY "Leitura de jornalistas e OCS para todos" ON journalists
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Gestão de jornalistas para Diretor e Assessor" ON journalists;
CREATE POLICY "Gestão de jornalistas para Diretor e Assessor" ON journalists
    FOR ALL TO authenticated USING (
        public.current_user_role() IN ('director', 'press_officer')
    );

DROP POLICY IF EXISTS "Leitura de OCS para todos" ON media_outlets;
CREATE POLICY "Leitura de OCS para todos" ON media_outlets
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Gestão de OCS para Diretor e Assessor" ON media_outlets;
CREATE POLICY "Gestão de OCS para Diretor e Assessor" ON media_outlets
    FOR ALL TO authenticated USING (
        public.current_user_role() IN ('director', 'press_officer')
    );

-- F. Políticas para CLIPPINGS
DROP POLICY IF EXISTS "Leitura de clippings para todos" ON clippings;
CREATE POLICY "Leitura de clippings para todos" ON clippings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Gestão de clippings por Diretor, Assessor e Técnico" ON clippings;
CREATE POLICY "Gestão de clippings por Diretor, Assessor e Técnico" ON clippings
    FOR ALL TO authenticated USING (
        public.current_user_role() IN ('director', 'press_officer', 'junior')
    );

-- ==============================================================================
-- 11. SUPABASE REALTIME CONFIGURATION
-- ==============================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
    ALTER PUBLICATION supabase_realtime ADD TABLE daily_contacts;
    ALTER PUBLICATION supabase_realtime ADD TABLE projects;
    ALTER PUBLICATION supabase_realtime ADD TABLE clippings;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
