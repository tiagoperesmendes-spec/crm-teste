-- ==============================================================================
-- REPUTATION OS • INITIAL SEED DATA
-- Gabinete de Comunicação & CRM de Relações Públicas
-- ==============================================================================

-- 1. ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS)
INSERT INTO media_outlets (name, media_group, address, website_url, contact_email, phone, erc_registration, specialty, formats)
VALUES 
('Expresso', 'Grupo Impresa', 'Edifício São Francisco de Sales, Rua Calvet de Magalhães, 242, 2770-022 Paço de Arcos', 'https://expresso.pt', 'redacao@expresso.impresa.pt', '+351 214 698 000', 'ERC-J-101', 'Economia & Política', ARRAY['Online', 'Impresso']),
('Público', 'Sonaecom', 'Edifício Diogo Cão, Doca de Alcântara Norte, 1350-352 Lisboa', 'https://publico.pt', 'agenda@publico.pt', '+351 210 111 000', 'ERC-J-102', 'Nacional & Sociedade', ARRAY['Online', 'Impresso']),
('Jornal de Negócios', 'Medialivre', 'Rua Luciana Stegagno Picchio, 3, 1549-023 Lisboa', 'https://jornaldenegocios.pt', 'negocios@medialivre.pt', '+351 210 494 000', 'ERC-J-103', 'Mercados & Finanças', ARRAY['Online', 'Impresso']),
('ECO Economia Online', 'Swipe News', 'Avenida da Liberdade, 245, 4º Dto, 1250-143 Lisboa', 'https://eco.sapo.pt', 'redacao@eco.pt', '+351 211 387 100', 'ERC-O-201', 'Startups, Empresas & Macroeconomia', ARRAY['Online', 'Podcast']),
('RTP (Informação)', 'RTP - Rádio e Televisão de Portugal', 'Avenida Marechal Gomes da Costa, 37, 1849-030 Lisboa', 'https://rtp.pt/noticias', 'noticias@rtp.pt', '+351 217 947 000', 'ERC-TV-301', 'Informação Geral & Telejornais', ARRAY['TV', 'Online']),
('SIC Notícias', 'Grupo Impresa', 'Estrada da Outurela, 119, 2794-052 Carnaxide', 'https://sicnoticias.pt', 'sicnoticias@sic.pt', '+351 214 179 000', 'ERC-TV-302', 'Atualidade 24 Horas', ARRAY['TV', 'Online']),
('TSF Rádio Notícias', 'Global Media Group', 'Rua Gonçalo Cristóvão, 195-219, 4000-269 Porto', 'https://tsf.pt', 'tsf@tsf.pt', '+351 222 096 100', 'ERC-R-401', 'Debate & Entrevistas de Rádio', ARRAY['Rádio', 'Podcast'])
ON CONFLICT (name) DO NOTHING;

-- 2. JORNALISTAS DE REFERÊNCIA
INSERT INTO journalists (name, outlet_name, role_title, contact_email, contact_phone, intervention_area, registration_date, last_contact_date, notes)
VALUES
('Marta Figueiredo', 'Público', 'Grande Repórter', 'marta.figueiredo@publico.pt', '+351 912 345 678', 'Sustentabilidade & Energia', '2026-01-15', CURRENT_DATE, 'Prefere receber comunicados antes das 11h. Forte interesse em ESG e transição energética.'),
('Rui Almeida', 'Expresso', 'Editor-Adjunto de Economia', 'rui.almeida@expresso.impresa.pt', '+351 923 456 789', 'Banca & Mercados de Capitais', '2026-02-01', CURRENT_DATE, 'Contacto preferencial por WhatsApp para temas urgentes. Fecho à quinta-feira à tarde.'),
('Inês Carvalho', 'RTP (Informação)', 'Jornalista de Economia', 'ines.carvalho@rtp.pt', '+351 934 567 890', 'Macroeconomia & Finanças Públicas', '2026-02-10', CURRENT_DATE, 'Disponibilidade para peças de estúdio e diretos. Requer porta-vozes credenciados.'),
('Tiago Sousa', 'ECO Economia Online', 'Subdiretor', 'tiago.sousa@eco.pt', '+351 965 678 901', 'Tecnologia & Startups', '2026-03-01', CURRENT_DATE, 'Muito reativo a números inéditos, rondas de financiamento e exclusivos.'),
('Carla Antunes', 'Jornal de Negócios', 'Redatora Sénior', 'carla.antunes@medialivre.pt', '+351 918 789 012', 'Imobiliário & Construção', '2026-01-20', CURRENT_DATE - INTERVAL '100 days', 'Sem contacto nos últimos 90 dias. Necessário reatar relação para a próxima conferência imobiliária.')
ON CONFLICT DO NOTHING;

-- 3. PROJETOS EM ABERTO
INSERT INTO projects (name, client_or_brand, status, deadline, start_date, manager_name, description, budget_eur)
VALUES
('Expansão Ibérica 2026', 'Grupo M', 'open', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE - INTERVAL '30 days', 'Leonor Rodrigues', 'Estratégia integrada de relações públicas e diplomacia corporativa para a entrada no mercado espanhol.', 45000.00),
('Lançamento Hub Tech Lisboa', 'Venture Capital X', 'open', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE - INTERVAL '20 days', 'Leonor Rodrigues', 'Conferência de imprensa com presença institucional e anúncio do fundo de 100M€ para inovação.', 28000.00),
('Cimeira de Energia & Clima', 'Fundação Verde', 'open', CURRENT_DATE + INTERVAL '28 days', CURRENT_DATE - INTERVAL '15 days', 'Sofia Ramos', 'Gestão de pautas e cobertura mediática para o fórum ibérico de sustentabilidade.', 35000.00),
('Campanha de Reputação Hospitalar', 'Clínicas Viva', 'open', CURRENT_DATE + INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'Sofia Ramos', 'Comunicação de crise e reforço da confiança na nova unidade de oncologia.', 50000.00),
('Apresentação de Resultados Anuais', 'Banco Horizonte', 'open', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE - INTERVAL '45 days', 'Leonor Rodrigues', 'Conferência com analistas, pequeno-almoço com diretores de economia e distribuição de press kit.', 60000.00),
('Relatório Anual ESG 2025/26', 'Logística Global', 'open', CURRENT_DATE + INTERVAL '21 days', CURRENT_DATE - INTERVAL '18 days', 'Gonçalo Neves', 'Disponibilização de indicadores de descarbonização e impacto social nos media económicos.', 22000.00),
('Fórum de Inovação Industrial', 'Associação Indústria', 'open', CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE - INTERVAL '5 days', 'Leonor Rodrigues', 'Campanha de awareness para o setor exportador com visitas guiadas de jornalistas às fábricas.', 38000.00)
ON CONFLICT DO NOTHING;

-- 4. TAREFAS ("O QUE TENHO PARA FAZER")
INSERT INTO tasks (title, project_name, priority, due_date, due_time, status, assignee_name, client_or_brand, description, subtasks, comments)
VALUES
('Enviar comunicado de imprensa ao Expresso', 'Expansão Ibérica 2026', 'alta', CURRENT_DATE, '12:00', 'pending', 'Leonor Rodrigues', 'Grupo M', 'Envio exclusivo do anúncio de expansão sob embargo até às 06h00 de sexta-feira.', '[{"id":"st-1","title":"Rever versão final do release com o departamento jurídico","completed":true},{"id":"st-2","title":"Anexar infografia em alta resolução","completed":true},{"id":"st-3","title":"Disparar email ao Rui Almeida","completed":false}]'::JSONB, '[{"id":"cm-1","author":"Leonor Rodrigues","text":"Aprovado pelo cliente esta manhã. Seguir plano de embargo.","created_at":"2026-11-17T09:30:00Z"}]'::JSONB),
('Follow-up com Marta Figueiredo (Público)', 'Cimeira de Energia & Clima', 'alta', CURRENT_DATE, '15:30', 'pending', 'Leonor Rodrigues', 'Fundação Verde', 'Confirmar receção do convite para a mesa-redonda de transição energética.', '[{"id":"st-4","title":"Telefonar após o fecho de almoço","completed":false}]'::JSONB, '[]'::JSONB),
('Concluir Q&A para conferência do Banco Horizonte', 'Apresentação de Resultados Anuais', 'urgente', CURRENT_DATE - INTERVAL '1 day', '10:00', 'pending', 'Leonor Rodrigues', 'Banco Horizonte', 'Preparar respostas a perguntas sensíveis sobre margem financeira e taxas de juro.', '[{"id":"st-5","title":"Validar números com o CFO","completed":true}]'::JSONB, '[]'::JSONB),
('Rever briefing do cliente e matriz de risco', 'Campanha de Reputação Hospitalar', 'urgente', CURRENT_DATE - INTERVAL '2 days', '17:00', 'pending', 'Sofia Ramos', 'Clínicas Viva', 'Análise das principais vulnerabilidades mediáticas.', '[]'::JSONB, '[]'::JSONB),
('Preparar relatório de clipping de outubro', 'Expansão Ibérica 2026', 'normal', CURRENT_DATE + INTERVAL '1 day', '18:00', 'pending', 'Gonçalo Neves', 'Grupo M', 'Compilação de todas as peças de imprensa e cálculo do AVE acumulado.', '[]'::JSONB, '[]'::JSONB),
('Atualizar lista de jornalistas de economia', 'Geral', 'normal', CURRENT_DATE + INTERVAL '2 days', '18:00', 'pending', 'Gonçalo Neves', 'Gabinete', 'Verificar contactos dos jornalistas com mais de 90 dias sem interação.', '[]'::JSONB, '[]'::JSONB)
ON CONFLICT DO NOTHING;

-- 5. CONTACTOS DIÁRIOS
INSERT INTO daily_contacts (contact_name, outlet_name, contact_type, status, subject_or_notes, contact_date, contact_time)
VALUES
('Marta Figueiredo', 'Público', 'email', 'respondeu', 'Comunicado sobre a Cimeira de Energia aceite; solicitou entrevista exclusiva com o porta-voz.', CURRENT_DATE, '10:15'),
('Rui Almeida', 'Expresso', 'chamada', 'sem_resposta', 'Tentativa de contacto para avanço de resultados anuais; enviada mensagem por WhatsApp.', CURRENT_DATE, '11:45'),
('Inês Carvalho', 'RTP (Informação)', 'email', 'respondeu', 'Pitch de economia validado; equipa de reportagem agendada para quinta-feira às 14h00.', CURRENT_DATE, '14:20'),
('Tiago Sousa', 'ECO Economia Online', 'email', 'enviado', 'Seguimento de dados sobre o investimento no Hub Tech Lisboa.', CURRENT_DATE, '15:10')
ON CONFLICT DO NOTHING;

-- 6. CLIPPINGS & VALOR AVE
INSERT INTO clippings (title, outlet, journalist_name, coverage_type, media_tier, sentiment, published_at, reach_impressions, ave_value_eur, url, summary)
VALUES
('Grupo M avança para Espanha com investimento de 50 milhões', 'Expresso', 'Rui Almeida', 'online', 'tier_1', 'muito_positivo', CURRENT_DATE - INTERVAL '3 days', 285000, 14200.00, 'https://expresso.pt', 'Destaque de primeira página no caderno de economia sobre a expansão ibérica.'),
('Novo Hub Tech Lisboa atrai fundos internacionais de 100M€', 'ECO Economia Online', 'Tiago Sousa', 'online', 'tier_1', 'positivo', CURRENT_DATE - INTERVAL '5 days', 190000, 9500.00, 'https://eco.sapo.pt', 'Análise detalhada sobre o impacto no ecossistema de inovação da capital.'),
('Transição energética é o maior desafio da indústria portuguesa', 'Público', 'Marta Figueiredo', 'imprensa_escrita', 'tier_1', 'positivo', CURRENT_DATE - INTERVAL '7 days', 165000, 12800.00, 'https://publico.pt', 'Artigo de fundo com citação direta do presidente da Fundação Verde.')
ON CONFLICT DO NOTHING;
