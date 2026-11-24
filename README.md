# ReputationOS • Gabinete de Comunicação & CRM de Relações Públicas

Sistema executivo de gestão de pautas de imprensa, relações públicas, dossiês de projetos, cobertura mediática e análise de valor publicitário equivalente (AVE).

Desenvolvido para diretores de comunicação e consultores seniores de relações públicas.

---

## 1. Stack Tecnológica de Produção

- **Frontend & Aplicação**: Next.js 14+ (App Router, Server Components, TypeScript)
- **Base de Dados & Backend**: Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth SSR, Storage, Realtime)
- **Alojamento & Edge**: Vercel (Edge Network na Europa - `fra1`, Serverless Functions, CI/CD)
- **Design & Tokens**: Tailwind CSS com estética Apple (espaço e subtileza), Notion (blocos neutros) e Attio (grelhas e etiquetas estáveis pastel)

---

## 2. Estrutura do Projeto

```text
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx      # Ecrã de autenticação com suporte RBAC
│   │   ├── globals.css                # Reset de estilos e classes ReputationOS
│   │   ├── layout.tsx                 # Root layout com tipografia e metadados
│   │   └── page.tsx                   # Dashboard executivo principal
│   ├── components/
│   │   ├── Sidebar.tsx                # Menu retrátil com perfis e badges
│   │   ├── Header.tsx                 # Barra superior com saudação e Command Palette
│   │   ├── MetricCards.tsx            # 8 Cartões KPI com navegação temática
│   │   ├── TasksTable.tsx             # Grelha de tarefas com edição inline
│   │   ├── ContactsList.tsx           # Diário de contactos efetuados
│   │   └── TaskDetailDrawer.tsx       # Gaveta de detalhe de tarefa com subtarefas
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser Client (para Realtime)
│   │   │   ├── server.ts              # Server Client com Cookies SSR
│   │   │   ├── middleware.ts          # Sessão segura no Edge
│   │   │   └── roles.ts               # Matriz de permissões institucionais (RBAC)
│   │   └── mock-data.ts               # Dados realistas verificados para arranque
│   ├── types/
│   │   └── pr-crm.ts                  # Interfaces TypeScript do domínio de RP
│   └── middleware.ts                  # Proteção de rotas em Next.js
├── supabase/
│   ├── migrations/
│   │   └── 20261117_master_schema_rls.sql # Esquema completo com RLS
│   └── seed.sql                       # Dados de demonstração
├── tailwind.config.ts                 # Tokens da marca e paleta Attio
├── next.config.mjs                    # Headers de segurança HTTP
└── vercel.json                        # Configuração de deploy Vercel
```

---

## 3. Instruções de Implementação no Supabase

1. Aceda ao painel do seu projeto no Supabase (`https://supabase.com/dashboard`).
2. Abra o **SQL Editor**.
3. Execute o script [supabase/migrations/20261117_master_schema_rls.sql](file:///c:/Users/tiago/Desktop/crm-teste/supabase/migrations/20261117_master_schema_rls.sql) para criar as tabelas, tipos ENUM e políticas de segurança RLS.
4. Execute o script [supabase/seed.sql](file:///c:/Users/tiago/Desktop/crm-teste/supabase/seed.sql) para popular a base de dados com as 7 campanhas, tarefas e base de jornalistas.

---

## 4. Instruções de Implementação na Vercel

1. Ligue o repositório GitHub ao projeto na **Vercel**.
2. Configure as Variáveis de Ambiente no painel da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública anónima do Supabase
3. O deploy é executado automaticamente pela Vercel com geração estática e Serverless Functions otimizadas.
