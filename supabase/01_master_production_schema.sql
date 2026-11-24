-- ==============================================================================
-- REPUTATION OS / MODO CRM • ESQUEMA MESTRE DE PRODUÇÃO (SUPABASE + POSTGRESQL)
-- Versão 2.1 • Otimizado para Vercel, Supabase Realtime & Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUM PERSONALIZADOS
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
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_urgency') THEN
        CREATE TYPE request_urgency AS ENUM ('baixa', 'media', 'alta', 'urgente_crise');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pendente_analise', 'aguarda_porta_voz', 'rascunho_aprovacao', 'concluido', 'recusado');
    END IF;
END $$;

-- 3. TABELA DE PERFIS DE UTILIZADOR (INTEGRADA COM AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'press_officer' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger de sincronização automática com novos utilizadores criados no Supabase Auth
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

-- 4. TABELA DE ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS / MEDIA OUTLETS)
CREATE TABLE IF NOT EXISTS public.media_outlets (
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

-- 5. TABELA DE JORNALISTAS (CRM & REDAÇÕES)
CREATE TABLE IF NOT EXISTS public.journalists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    outlet_id UUID REFERENCES public.media_outlets(id) ON DELETE SET NULL,
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

-- 6. TABELA DE PROJETOS (DOSSIÊS DE COMUNICAÇÃO & CAMPANHAS)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    client_or_brand VARCHAR(255) DEFAULT 'Institucional' NOT NULL,
    status project_status DEFAULT 'open' NOT NULL,
    deadline DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    manager_name VARCHAR(255) DEFAULT 'Leonor Rodrigues',
    manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    team_members TEXT[] DEFAULT ARRAY['Leonor Rodrigues', 'Sofia Ramos']::TEXT[],
    description TEXT,
    budget_eur NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA DE TAREFAS ("O QUE TENHO PARA FAZER")
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    project_name VARCHAR(255) DEFAULT 'Geral',
    priority task_priority DEFAULT 'normal' NOT NULL,
    due_date DATE NOT NULL,
    due_time VARCHAR(10) DEFAULT '18:00',
    status task_status DEFAULT 'pending' NOT NULL,
    assignee_name VARCHAR(255) DEFAULT 'Leonor Rodrigues',
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_or_brand VARCHAR(255),
    description TEXT,
    subtasks JSONB DEFAULT '[]'::JSONB,
    comments JSONB DEFAULT '[]'::JSONB,
    audit_log JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABELA DE CONTACTOS DIÁRIOS (REGISTO DE INTERAÇÕES)
CREATE TABLE IF NOT EXISTS public.daily_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name VARCHAR(255) NOT NULL,
    journalist_id UUID REFERENCES public.journalists(id) ON DELETE SET NULL,
    outlet_name VARCHAR(255),
    contact_type contact_type DEFAULT 'chamada' NOT NULL,
    status contact_status DEFAULT 'respondeu' NOT NULL,
    subject_or_notes TEXT,
    contact_date DATE DEFAULT CURRENT_DATE NOT NULL,
    contact_time VARCHAR(10) DEFAULT '11:00',
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger: Atualização automática da data de último contacto do jornalista
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

DROP TRIGGER IF EXISTS on_daily_contact_logged ON public.daily_contacts;
CREATE TRIGGER on_daily_contact_logged
    AFTER INSERT OR UPDATE ON public.daily_contacts
    FOR EACH ROW EXECUTE FUNCTION public.update_journalist_last_contact();

-- 9. TABELA DE PEDIDOS DE IMPRENSA (PR REQUESTS & GESTÃO DE CRISE)
CREATE TABLE IF NOT EXISTS public.pr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    journalist_id UUID REFERENCES public.journalists(id) ON DELETE SET NULL,
    journalist_name VARCHAR(255) NOT NULL,
    outlet VARCHAR(255) NOT NULL,
    subject TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    urgency request_urgency DEFAULT 'media',
    status request_status DEFAULT 'pendente_analise',
    spokesperson_assigned VARCHAR(255),
    talking_points TEXT,
    response_draft TEXT,
    final_response_delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABELA DE CLIPPINGS (COBERTURA MEDIÁTICA & AVE)
CREATE TABLE IF NOT EXISTS public.clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    outlet VARCHAR(255) NOT NULL,
    outlet_id UUID REFERENCES public.media_outlets(id) ON DELETE SET NULL,
    journalist_name VARCHAR(255),
    journalist_id UUID REFERENCES public.journalists(id) ON DELETE SET NULL,
    coverage_type coverage_type DEFAULT 'online' NOT NULL,
    media_tier media_tier DEFAULT 'tier_1' NOT NULL,
    sentiment sentiment_type DEFAULT 'positivo' NOT NULL,
    published_at DATE DEFAULT CURRENT_DATE NOT NULL,
    reach_impressions BIGINT DEFAULT 0,
    ave_value_eur NUMERIC(12, 2) DEFAULT 0.00,
    url TEXT,
    summary TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    related_request_id UUID REFERENCES public.pr_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABELA DE PRESS RELEASES / COMUNICADOS
CREATE TABLE IF NOT EXISTS public.press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(150),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    recipients_count INT DEFAULT 0,
    open_rate NUMERIC(5, 2) DEFAULT 0.00,
    pickups_count INT DEFAULT 0,
    document_url TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 12. ÍNDICES DE PERFORMANCE (VELOCIDADE DE LEITURA E FILTROS)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_journalists_outlet_id ON public.journalists(outlet_id);
CREATE INDEX IF NOT EXISTS idx_daily_contacts_date ON public.daily_contacts(contact_date);
CREATE INDEX IF NOT EXISTS idx_daily_contacts_project ON public.daily_contacts(project_id);
CREATE INDEX IF NOT EXISTS idx_clippings_published ON public.clippings(published_at);
CREATE INDEX IF NOT EXISTS idx_clippings_project ON public.clippings(project_id);
CREATE INDEX IF NOT EXISTS idx_pr_requests_status ON public.pr_requests(status);

-- ==============================================================================
-- 13. POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso: Leitura e Escrita Colaborativa para Membros Autenticados
DO $$
DECLARE
    t text;
    tables text[] := ARRAY['media_outlets', 'journalists', 'projects', 'tasks', 'daily_contacts', 'clippings', 'pr_requests', 'press_releases'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Acesso Leitura Autenticada em %s" ON public.%s;', t, t);
        EXECUTE format('CREATE POLICY "Acesso Leitura Autenticada em %s" ON public.%s FOR SELECT TO authenticated USING (true);', t, t);

        EXECUTE format('DROP POLICY IF EXISTS "Acesso Escrita Autenticada em %s" ON public.%s;', t, t);
        EXECUTE format('CREATE POLICY "Acesso Escrita Autenticada em %s" ON public.%s FOR ALL TO authenticated USING (true) WITH CHECK (true);', t, t);

        -- Política aberta adicional para suportar consultas públicas de anon key se necessário
        EXECUTE format('DROP POLICY IF EXISTS "Acesso Anon Leitura em %s" ON public.%s;', t, t);
        EXECUTE format('CREATE POLICY "Acesso Anon Leitura em %s" ON public.%s FOR SELECT TO anon USING (true);', t, t);

        EXECUTE format('DROP POLICY IF EXISTS "Acesso Anon Escrita em %s" ON public.%s;', t, t);
        EXECUTE format('CREATE POLICY "Acesso Anon Escrita em %s" ON public.%s FOR ALL TO anon USING (true) WITH CHECK (true);', t, t);
    END LOOP;
END $$;

-- Profiles: Leitura autenticada e atualização pelo próprio utilizador
DROP POLICY IF EXISTS "Perfis Leitura Autenticada" ON public.profiles;
CREATE POLICY "Perfis Leitura Autenticada" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Perfis Edição Própria" ON public.profiles;
CREATE POLICY "Perfis Edição Própria" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ==============================================================================
-- 14. ATIVAÇÃO SUPABASE REALTIME (ATUALIZAÇÕES INSTANTÂNEAS NO CRM)
-- ==============================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_contacts;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.journalists;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.media_outlets;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clippings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pr_requests;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
