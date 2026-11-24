-- ==============================================================================
-- ATUALIZAÇÃO SUPABASE: TABELAS DE PROJETOS, TAREFAS E CONTACTOS DIÁRIOS
-- ==============================================================================

-- 1. TABELA DE PROJETOS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    client_or_brand VARCHAR(255) DEFAULT 'Institucional',
    status VARCHAR(50) DEFAULT 'open',              -- 'open' (em aberto) ou 'completed' (concluído)
    deadline DATE,                                  -- Data de entrega do projeto
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE TAREFAS (O QUE TENHO PARA FAZER)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255) DEFAULT 'Geral',
    priority VARCHAR(50) DEFAULT 'normal',          -- 'urgente', 'alta', 'normal', 'baixa'
    due_date DATE NOT NULL,                         -- Data de entrega / deadline
    status VARCHAR(50) DEFAULT 'pending',           -- 'pending' (a fazer) ou 'completed' (concluída)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE CONTACTOS DIÁRIOS (CONTACTOS EFETUADOS HOJE)
CREATE TABLE IF NOT EXISTS daily_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name VARCHAR(255) NOT NULL,             -- Nome do jornalista ou assessor
    outlet_name VARCHAR(255),                       -- Órgão de Comunicação (OCS)
    contact_type VARCHAR(50) DEFAULT 'chamada',     -- 'chamada', 'email', 'whatsapp', 'reuniao'
    subject_or_notes TEXT,                          -- Assunto / Pauta
    contact_date DATE DEFAULT CURRENT_DATE NOT NULL,-- Data do contacto
    contact_time VARCHAR(10),                       -- Hora ex: '14:30'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PERMISSÕES RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total aos projetos" ON projects;
CREATE POLICY "Acesso total aos projetos" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total às tarefas" ON tasks;
CREATE POLICY "Acesso total às tarefas" ON tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total aos contactos diários" ON daily_contacts;
CREATE POLICY "Acesso total aos contactos diários" ON daily_contacts FOR ALL USING (true);
