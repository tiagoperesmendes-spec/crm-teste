-- ==============================================================================
-- ATUALIZAÇÃO SUPABASE: TABELAS DE OCS (ÓRGÃOS DE COMUNICAÇÃO) E JORNALISTAS
-- ==============================================================================

-- 1. TABELA DE ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS)
CREATE TABLE IF NOT EXISTS media_outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,                                     -- Morada da sede/redação
    media_group VARCHAR(255),                         -- Grupo a que pertence (Impresa, Media Capital, etc.)
    website_url TEXT,                                 -- Link do site
    contact_email VARCHAR(255),                       -- Contacto / email de agenda
    phone VARCHAR(50),                                -- Telefone geral da redação
    erc_registration VARCHAR(100),                    -- Registo da ERC (tipo de meio)
    specialty VARCHAR(150),                           -- Especialidade (Economia, Geral, Política, etc.)
    formats TEXT[] DEFAULT ARRAY['Online']::TEXT[],   -- Formato em multi-etiqueta (Online, Físico, TV, Rádio, etc.)
    logo_url TEXT,                                    -- Logo do meio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA COMPLETA DE JORNALISTAS
CREATE TABLE IF NOT EXISTS journalists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),                       -- Email direto
    contact_phone VARCHAR(50),                        -- Telefone / WhatsApp
    outlet_id UUID REFERENCES media_outlets(id) ON DELETE SET NULL,
    outlet_name VARCHAR(255) NOT NULL,                -- Nome do OCS
    intervention_area VARCHAR(150),                   -- Área de intervenção (Economia, Política, etc.)
    links TEXT,                                       -- Links (LinkedIn, X, Portfólio)
    registration_date DATE DEFAULT CURRENT_DATE,      -- Data de registo / início
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PERMISSÕES RLS (Row Level Security)
ALTER TABLE media_outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total aos OCS" ON media_outlets;
CREATE POLICY "Acesso total aos OCS" ON media_outlets FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos jornalistas" ON journalists;
CREATE POLICY "Acesso total aos jornalistas" ON journalists FOR ALL USING (true);
