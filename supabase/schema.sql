-- ==============================================================================
-- REPUTATION OS / PR CRM - ESQUEMA SUPABASE MASTER (100% LIMPO - A ZEROS)
-- ==============================================================================

-- 1. CRIAÇÃO SEGURA DE TIPOS ENUM
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_urgency') THEN
        CREATE TYPE request_urgency AS ENUM ('baixa', 'media', 'alta', 'urgente_crise');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pendente_analise', 'aguarda_porta_voz', 'rascunho_aprovacao', 'concluido', 'recusado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_tier') THEN
        CREATE TYPE media_tier AS ENUM ('tier_1', 'tier_2', 'tier_3', 'influencer_especializado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sentiment_type') THEN
        CREATE TYPE sentiment_type AS ENUM ('muito_positivo', 'positivo', 'neutro', 'negativo', 'critico');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coverage_type') THEN
        CREATE TYPE coverage_type AS ENUM ('online', 'imprensa_escrita', 'televisao', 'radio', 'podcast');
    END IF;
END $$;

-- 2. TABELA DE ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS)
CREATE TABLE IF NOT EXISTS media_outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,                                     -- Morada da sede/redação
    media_group VARCHAR(255),                         -- Grupo a que pertence (Impresa, Media Capital, etc.)
    website_url TEXT,                                 -- Link do site
    contact_email VARCHAR(255),                       -- Contacto / email de agenda
    phone VARCHAR(50),                                -- Telefone geral da redação
    erc_registration VARCHAR(100),                    -- Registo da ERC (tipo de meio)
    specialty VARCHAR(150),                           -- Especialidade (Economia, Geral, etc.)
    formats TEXT[] DEFAULT ARRAY['Online']::TEXT[],   -- Formato em multi-etiqueta (Online, Físico, TV, Rádio, etc.)
    logo_url TEXT,                                    -- Logo do meio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE JORNALISTAS (CRM)
CREATE TABLE IF NOT EXISTS journalists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),                       -- Email direto
    contact_phone VARCHAR(50),                        -- Telefone / WhatsApp
    outlet_id UUID REFERENCES media_outlets(id) ON DELETE SET NULL,
    outlet_name VARCHAR(255) NOT NULL,                -- Nome do OCS
    intervention_area VARCHAR(150),                   -- Área de intervenção (Economia, Política, Tech, etc.)
    links TEXT,                                       -- Links (LinkedIn, X, Portfólio)
    registration_date DATE DEFAULT CURRENT_DATE,      -- Data de registo
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PEDIDOS DE IMPRENSA (CORE: PEDIDOS PENDENTES E FLUXO)
CREATE TABLE IF NOT EXISTS pr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    journalist_id UUID REFERENCES journalists(id) ON DELETE SET NULL,
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

-- 5. TABELA DE CLIPPINGS & COBERTURA CONCLUÍDA ("O QUE JÁ FOI FEITO")
CREATE TABLE IF NOT EXISTS clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    outlet VARCHAR(255) NOT NULL,
    journalist_name VARCHAR(255),
    coverage_type coverage_type DEFAULT 'online',
    media_tier media_tier DEFAULT 'tier_1',
    sentiment sentiment_type DEFAULT 'positivo',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reach_impressions BIGINT DEFAULT 0,
    ave_value_eur NUMERIC(10, 2) DEFAULT 0.00,
    url TEXT,
    summary TEXT,
    related_request_id UUID REFERENCES pr_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE PRESS RELEASES
CREATE TABLE IF NOT EXISTS press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(150),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    recipients_count INT DEFAULT 0,
    open_rate NUMERIC(5, 2) DEFAULT 0.00,
    pickups_count INT DEFAULT 0,
    document_url TEXT
);

-- 7. POLÍTICAS RLS
ALTER TABLE media_outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total aos OCS" ON media_outlets;
CREATE POLICY "Acesso total aos OCS" ON media_outlets FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos jornalistas" ON journalists;
CREATE POLICY "Acesso total aos jornalistas" ON journalists FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos pedidos de imprensa" ON pr_requests;
CREATE POLICY "Acesso total aos pedidos de imprensa" ON pr_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos clippings" ON clippings;
CREATE POLICY "Acesso total aos clippings" ON clippings FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos comunicados" ON press_releases;
CREATE POLICY "Acesso total aos comunicados" ON press_releases FOR ALL USING (true);
