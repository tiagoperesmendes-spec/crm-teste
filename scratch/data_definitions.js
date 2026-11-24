    // ==========================================
    // 2. DADOS INICIAIS DE EXEMPLO (PR & COMUNICAÇÃO)
    // ==========================================
    let activeProjectId = 'sample-proj-1';
    let activeTaskId = 'sample-task-1';
    let currentContactPeriod = 'today';
    let currentProjectFilter = 'all';
    let currentJourTab = 'all';
    let currentProjectDetailTab = 'overview';
    let lastEditedTaskBackup = null;

    function getOffsetDateString(days) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    }

    const DEFAULT_SAMPLE_TASKS = [
      // 5 TAREFAS PARA HOJE (3 de prioridade alta, 2 normal)
      {
        id: 'sample-task-1',
        title: 'Enviar comunicado de imprensa ao Expresso',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '12:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Garantir envio antes das 12h00 para fecho da edição semanal de Economia. Destacar o volume de 25M de investimento.',
        journalist_name: 'Rui Almeida (Expresso)',
        subtasks: [
          { id: 'st-1-1', title: 'Rever citação oficial do Presidente Executivo', done: true },
          { id: 'st-1-2', title: 'Anexar infografia com mapa de novas localizações', done: false },
          { id: 'st-1-3', title: 'Confirmar receção por telefone com a redação', done: false }
        ],
        comments: [
          { author: 'Leonor Rodrigues', role: 'Diretora de RP', text: 'O draft final foi aprovado pelo cliente às 09h30.', time: 'Hoje, 09:45' }
        ],
        activity_log: [
          'Criado por Leonor Rodrigues',
          'Prioridade definida como Alta'
        ]
      },
      {
        id: 'sample-task-2',
        title: 'Follow-up com Marta Figueiredo (Público)',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '14:30',
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Verificar receção do pitch exclusivo sobre a redução de 40% da pegada carbónica.',
        journalist_name: 'Marta Figueiredo (Público)',
        subtasks: [
          { id: 'st-2-1', title: 'Enviar relatório técnico de validação da pegada', done: true },
          { id: 'st-2-2', title: 'Propor horário para entrevista com o Diretor de Sustentabilidade', done: false }
        ],
        comments: [
          { author: 'Tiago Mendes', role: 'Consultor de RP', text: 'A jornalista mostrou interesse prévio na conferência do mês passado.', time: 'Hoje, 10:15' }
        ],
        activity_log: ['Criado por Tiago Mendes']
      },
      {
        id: 'sample-task-3',
        title: 'Alinhar declarações com porta-voz oficial',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '16:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Briefing preparatório de 20 minutos com o Diretor de Operações antes do direto na SIC Notícias.',
        journalist_name: 'Sofia Martins (SIC Notícias)',
        subtasks: [
          { id: 'st-3-1', title: 'Simulação de 3 perguntas difíceis sobre concorrência', done: true },
          { id: 'st-3-2', title: 'Envio de pontos-chave por SMS de apoio', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-task-4',
        title: 'Preparar dossier de imprensa para a RTP',
        priority: 'normal',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '17:30',
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Compilar fotografias de alta resolução do novo polo no Beato e ficha técnica dos postos de trabalho.',
        journalist_name: 'Inês Carvalho (RTP)',
        subtasks: [
          { id: 'st-4-1', title: 'Upload para o link seguro do Media Kit', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-task-5',
        title: 'Validar versão espanhola do comunicado',
        priority: 'normal',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '18:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Carlos Silva',
        status: 'pending',
        notes: 'Revisão linguística para envio à agência parceira de Madrid (Expansión e El Economista).',
        journalist_name: 'Redações Espanha',
        subtasks: [
          { id: 'st-5-1', title: 'Conferir cotações em euros e dados fiscais', done: true }
        ],
        comments: [],
        activity_log: ['Criado por Carlos Silva']
      },

      // 2 TAREFAS EM ATRASO (Prazos passados, estado pendente)
      {
        id: 'sample-task-6',
        title: 'Enviar notas biográficas da administração',
        priority: 'urgente',
        due_date: getOffsetDateString(-2),
        due_time: '11:00',
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        assignee: 'Carlos Silva',
        status: 'pending',
        notes: 'Pedidas com urgência pelo Jornal de Negócios para o perfil de abertura do caderno de empresas.',
        journalist_name: 'Ana Bento (Jornal de Negócios)',
        subtasks: [
          { id: 'st-6-1', title: 'Atualizar anos de mandato e percurso internacional', done: true },
          { id: 'st-6-2', title: 'Obter foto tipo passe em estúdio', done: false }
        ],
        comments: [
          { author: 'Leonor Rodrigues', role: 'Diretora de RP', text: 'Esta entrega está em atraso há 2 dias. Por favor priorizar.', time: 'Ontem, 14:00' }
        ],
        activity_log: ['Criado por Carlos Silva', 'Aviso de atraso emitido']
      },
      {
        id: 'sample-task-7',
        title: 'Confirmar credenciação de jornalistas',
        priority: 'alta',
        due_date: getOffsetDateString(-1),
        due_time: '18:00',
        project_name: 'Encontro com Diretores de Informação',
        client_or_brand: 'Institucional',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Lista de 15 diretores de redação convidados para o almoço institucional reservado.',
        journalist_name: 'Diretores OCS',
        subtasks: [
          { id: 'st-7-1', title: 'Contactar assistentes dos 3 diretores ainda pendentes', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },

      // 4 ENTREGAS ESTA SEMANA
      {
        id: 'sample-task-8',
        title: 'Preparar relatório de clipping de outubro',
        priority: 'normal',
        due_date: getOffsetDateString(1),
        due_time: '15:00',
        project_name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Incluir análise AVE, tom por meio e evolução de sentimento no trimestre.',
        journalist_name: '—',
        subtasks: [
          { id: 'st-8-1', title: 'Exportar métricas de alcance das 18 peças', done: true },
          { id: 'st-8-2', title: 'Gerar gráficos de distribuição por OCS', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Tiago Mendes']
      },
      {
        id: 'sample-task-9',
        title: 'Atualizar lista de jornalistas de economia',
        priority: 'normal',
        due_date: getOffsetDateString(2),
        due_time: '12:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Confirmar novos redactores e saídas recentes nas redações de economia de Lisboa e Porto.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-task-10',
        title: 'Rever briefing do cliente PharmaPlus',
        priority: 'baixa',
        due_date: getOffsetDateString(3),
        due_time: '17:00',
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Alinhamento do plano de comunicação para o primeiro trimestre de 2027.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-task-11',
        title: 'Envio de convites para apresentação à imprensa',
        priority: 'alta',
        due_date: getOffsetDateString(4),
        due_time: '10:00',
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Envio personalizado de convite com confirmação de presença até sexta-feira.',
        journalist_name: 'Jornalistas Tech',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Tiago Mendes']
      },

      // TAREFAS JÁ CONCLUÍDAS
      {
        id: 'sample-task-12',
        title: 'Mapeamento de 20 jornalistas ibéricos de referência',
        priority: 'normal',
        due_date: getOffsetDateString(-4),
        due_time: '18:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'completed',
        notes: 'Lista completa validada pela Direção de RP e partilhada com o cliente.',
        journalist_name: 'Vários',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues', 'Concluída']
      },
      {
        id: 'sample-task-13',
        title: 'Aprovação de documento de Q&A com o conselho',
        priority: 'alta',
        due_date: getOffsetDateString(-3),
        due_time: '12:00',
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        assignee: 'Carlos Silva',
        status: 'completed',
        notes: 'Documento confidencial com respostas a perguntas financeiras sensíveis aprovado.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Carlos Silva', 'Concluída']
      }
    ];

    const DEFAULT_SAMPLE_PROJECTS = [
      {
        id: 'sample-proj-1',
        name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Tiago Mendes', 'Carlos Silva'],
        start_date: '2026-10-01',
        deadline: '2026-11-20',
        budget: '15.000 €',
        status: 'in_progress',
        description: 'Campanha integrada de relações públicas e assessoria mediática para o plano de expansão na Península Ibérica. Coordenação de entrevistas exclusivas em Lisboa e Madrid.',
        target_journalists: [
          { name: 'Rui Almeida', outlet: 'Expresso', area: 'Economia', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Marta Figueiredo', outlet: 'Público', area: 'Empresas', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Pedro Ramos', outlet: 'ECO Economia Online', area: 'Mercados', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Sofia Martins', outlet: 'SIC Notícias', area: 'Televisão', status: 'Publicou', last_contact: getOffsetDateString(-2) },
          { name: 'Ana Bento', outlet: 'Jornal de Negócios', area: 'Finanças', status: 'Por contactar', last_contact: '—' },
          { name: 'Miguel Costa', outlet: 'Dinheiro Vivo', area: 'Negócios', status: 'Contactado', last_contact: getOffsetDateString(-1) }
        ],
        documents: [
          { title: 'Comunicado de Imprensa - Expansão Ibérica (PT/ES)', type: 'PDF', date: '14 Nov 2026', size: '1.4 MB' },
          { title: 'Dossier Institucional Grupo M - Resultados e Metas', type: 'PDF', date: '12 Nov 2026', size: '3.8 MB' },
          { title: 'Banco de Imagens Alta Resolução Nova Sede', type: 'ZIP', date: '10 Nov 2026', size: '28.5 MB' }
        ],
        activity_log: [
          'Projeto iniciado por Leonor Rodrigues',
          'Aprovado comunicado de imprensa com o cliente Grupo M',
          'Entrevista exclusiva agendada com a SIC Notícias'
        ]
      },
      {
        id: 'sample-proj-2',
        name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        manager: 'Tiago Mendes',
        team: ['Tiago Mendes', 'Leonor Rodrigues'],
        start_date: '2026-10-15',
        deadline: '2026-11-25',
        budget: '12.500 €',
        status: 'in_progress',
        description: 'Posicionamento da GreenCorp como referência europeia em descarbonização industrial e economia circular.',
        target_journalists: [
          { name: 'Marta Figueiredo', outlet: 'Público', area: 'Sustentabilidade', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Tiago Sousa', outlet: 'Observador', area: 'Ambiente', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'André Santos', outlet: 'Jornal Económico', area: 'ESG', status: 'Recusou', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [
          { title: 'Relatório Técnico de Pegada Carbónica Auditado', type: 'PDF', date: '08 Nov 2026', size: '4.2 MB' }
        ],
        activity_log: ['Projeto iniciado por Tiago Mendes']
      },
      {
        id: 'sample-proj-3',
        name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Tiago Mendes'],
        start_date: '2026-11-01',
        deadline: '2026-12-05',
        budget: '8.000 €',
        status: 'in_progress',
        description: 'Barómetro trimestral de perceção de marca, menções mediáticas e sentimento nos principais meios nacionais.',
        target_journalists: [],
        documents: [],
        activity_log: ['Criado pela Direção de RP']
      },
      {
        id: 'sample-proj-4',
        name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        manager: 'Helena Ramos',
        team: ['Helena Ramos', 'Tiago Mendes'],
        start_date: '2026-10-20',
        deadline: '2026-12-15',
        budget: '20.000 €',
        status: 'in_progress',
        description: 'Inauguração oficial do maior campus de inovação aberta e inteligência artificial de Lisboa, no Beato.',
        target_journalists: [
          { name: 'Inês Carvalho', outlet: 'RTP', area: 'Tecnologia', status: 'Publicou', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'João Ferreira', outlet: 'TVI / CNN Portugal', area: 'Inovação', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [
          { title: 'Press Kit Oficial - Tech Hub Lisboa 2026', type: 'PDF', date: '11 Nov 2026', size: '5.1 MB' }
        ],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-proj-5',
        name: 'Encontro com Diretores de Informação',
        client_or_brand: 'Institucional',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Helena Ramos'],
        start_date: '2026-11-05',
        deadline: '2026-11-30',
        budget: '6.500 €',
        status: 'in_progress',
        description: 'Almoço anual off-the-record com diretores dos principais canais de televisão e jornais generalistas.',
        target_journalists: [],
        documents: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-proj-6',
        name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        manager: 'Helena Ramos',
        team: ['Helena Ramos', 'Carlos Silva'],
        start_date: '2026-10-10',
        deadline: '2026-12-10',
        budget: '18.000 €',
        status: 'in_progress',
        description: 'Divulgação de nova linha de produtos de saúde preventiva junto de revistas especializadas e lifestyle.',
        target_journalists: [
          { name: 'Clara Nogueira', outlet: 'Visão', area: 'Saúde', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-proj-7',
        name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        manager: 'Carlos Silva',
        team: ['Carlos Silva', 'Leonor Rodrigues'],
        start_date: '2026-10-25',
        deadline: '2026-11-22',
        budget: '22.000 €',
        status: 'in_progress',
        description: 'Apresentação pública de resultados auditados do exercício de 2026, com conferência de imprensa e webcast.',
        target_journalists: [
          { name: 'Ana Bento', outlet: 'Jornal de Negócios', area: 'Mercados', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Miguel Costa', outlet: 'Dinheiro Vivo', area: 'Economia', status: 'Publicou', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [],
        activity_log: ['Criado por Carlos Silva']
      }
    ];

    // 12 CONTACTOS DE HOJE + 29 CONTACTOS DA SEMANA = 41 CONTACTOS NA SEMANA
    const DEFAULT_SAMPLE_CONTACTS = [
      // 12 CONTACTOS DE HOJE
      {
        id: 'contact-today-1',
        contact_name: 'Marta Figueiredo',
        outlet_name: 'Público',
        contact_type: 'email',
        subject_or_notes: 'Pitch sobre resultados de sustentabilidade GreenCorp',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '09:15',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Agendada entrevista com porta-voz para quinta-feira às 11h'
      },
      {
        id: 'contact-today-2',
        contact_name: 'Rui Almeida',
        outlet_name: 'Expresso',
        contact_type: 'chamada',
        subject_or_notes: 'Convite para almoço e pitch exclusivo de expansão',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '10:00',
        collaborator: 'Tiago Mendes',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Fazer novo telefonema de seguimento às 16h'
      },
      {
        id: 'contact-today-3',
        contact_name: 'Inês Carvalho',
        outlet_name: 'RTP',
        contact_type: 'email',
        subject_or_notes: 'Envio de press release e convite para gravação no Beato',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '10:45',
        collaborator: 'Helena Ramos',
        project_name: 'Lançamento Tech Hub Lisboa',
        next_step: 'Confirmou presença de equipa de imagem e repórter'
      },
      {
        id: 'contact-today-4',
        contact_name: 'Tiago Sousa',
        outlet_name: 'Observador',
        contact_type: 'email',
        subject_or_notes: 'Seguimento de artigo de opinião sobre transição energética',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '11:20',
        collaborator: 'Carlos Silva',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Aguardar validação da redação de Opinião'
      },
      {
        id: 'contact-today-5',
        contact_name: 'Ana Bento',
        outlet_name: 'Jornal de Negócios',
        contact_type: 'chamada',
        subject_or_notes: 'Apresentação antecipada dos indicadores financeiros',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '11:50',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Resultados Financeiros Anuais',
        next_step: 'Pediu envio de tabela comparativa de EBITDA'
      },
      {
        id: 'contact-today-6',
        contact_name: 'Pedro Ramos',
        outlet_name: 'ECO Economia Online',
        contact_type: 'whatsapp',
        subject_or_notes: 'Confirmação de recebimento de infografia em alta resolução',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '12:15',
        collaborator: 'Tiago Mendes',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Informou que peça sai hoje às 17h'
      },
      {
        id: 'contact-today-7',
        contact_name: 'Sofia Martins',
        outlet_name: 'SIC Notícias',
        contact_type: 'chamada',
        subject_or_notes: 'Coordenação de entrada em direto no jornal da tarde',
        status: 'Reunião agendada',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '13:40',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Briefing técnico via Zoom agendado para as 15h30'
      },
      {
        id: 'contact-today-8',
        contact_name: 'João Ferreira',
        outlet_name: 'TVI / CNN Portugal',
        contact_type: 'email',
        subject_or_notes: 'Proposta de reportagem especial sobre polos de inovação',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '14:10',
        collaborator: 'Helena Ramos',
        project_name: 'Lançamento Tech Hub Lisboa',
        next_step: 'Ligar para a coordenação de emissão amanhã de manhã'
      },
      {
        id: 'contact-today-9',
        contact_name: 'Clara Nogueira',
        outlet_name: 'Visão',
        contact_type: 'email',
        subject_or_notes: 'Apresentação de dossier científico de saúde preventiva',
        status: 'Interessado',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '14:45',
        collaborator: 'Tiago Mendes',
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        next_step: 'Enviar kit físico de informação à redação'
      },
      {
        id: 'contact-today-10',
        contact_name: 'Miguel Costa',
        outlet_name: 'Dinheiro Vivo',
        contact_type: 'chamada',
        subject_or_notes: 'Esclarecimento sobre novas admissões do Grupo M',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '15:10',
        collaborator: 'Carlos Silva',
        project_name: 'Resultados Financeiros Anuais',
        next_step: 'Notícia em redação para o fecho de amanhã'
      },
      {
        id: 'contact-today-11',
        contact_name: 'Luísa Vieira',
        outlet_name: 'Antena 1',
        contact_type: 'email',
        subject_or_notes: 'Pitch para rubrica de economia matinal',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '15:40',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Fazer contacto com produção do programa'
      },
      {
        id: 'contact-today-12',
        contact_name: 'André Santos',
        outlet_name: 'Jornal Económico',
        contact_type: 'whatsapp',
        subject_or_notes: 'Sugestão de ângulo para caderno especial de sustentabilidade',
        status: 'Recusou',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '16:20',
        collaborator: 'Tiago Mendes',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Caderno já fechado. Voltar a propor na edição de dezembro'
      },

      // 29 CONTACTOS ANTERIORES DA MESMA SEMANA (PARA TOTALIZAR 41 NA SEMANA)
      ...Array.from({ length: 29 }).map((_, idx) => {
        const collaborators = ['Leonor Rodrigues', 'Tiago Mendes', 'Helena Ramos', 'Carlos Silva'];
        const outlets = ['Expresso', 'Público', 'ECO Economia Online', 'Jornal de Negócios', 'Observador', 'SIC Notícias', 'RTP', 'Visão'];
        const channels = ['email', 'chamada', 'whatsapp', 'reuniao'];
        const statuses = ['Respondeu', 'Sem resposta', 'Interessado', 'Respondeu', 'Sem resposta'];
        const projects = ['Expansão Ibérica 2026', 'Pauta Sustentabilidade & ESG', 'Lançamento Tech Hub Lisboa', 'Resultados Financeiros Anuais'];
        const dayOffset = -((idx % 4) + 1);

        return {
          id: `contact-week-${idx + 13}`,
          contact_name: `Jornalista Convidado ${idx + 1}`,
          outlet_name: outlets[idx % outlets.length],
          contact_type: channels[idx % channels.length],
          subject_or_notes: `Interação editorial de acompanhamento ${idx + 1}`,
          status: statuses[idx % statuses.length],
          contact_date: getOffsetDateString(dayOffset),
          contact_time: `${10 + (idx % 7)}:${(idx * 13) % 60 < 10 ? '0' : ''}${(idx * 13) % 60}`,
          collaborator: collaborators[idx % collaborators.length],
          project_name: projects[idx % projects.length],
          next_step: idx % 2 === 0 ? 'Concluído com envio de informação' : 'Seguimento agendado'
        };
      })
    ];

    // EXATAMENTE 18 PEÇAS DE CLIPPING NO MÊS (12 Positivas, 5 Neutras, 1 Negativa | AVE: 84.500 € | Alcance: 1.25M)
    const DEFAULT_SAMPLE_CLIPPINGS = [
      // 12 POSITIVAS
      {
        id: 'clip-1',
        title: 'Grupo M acelera investimento ibérico com nova sede em Madrid',
        outlet_name: 'Expresso',
        journalist_name: 'Rui Almeida',
        published_date: '2026-11-14',
        type: 'Notícia de Destaque',
        sentiment: 'positivo',
        reach: 125000,
        ave_value: 14500,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://expresso.pt',
        summary: 'Página inteira no caderno de Economia destacando os 25M de investimento e expansão de mercado.'
      },
      {
        id: 'clip-2',
        title: 'Sustentabilidade: GreenCorp reduz pegada carbónica industrial em 40%',
        outlet_name: 'Público',
        journalist_name: 'Marta Figueiredo',
        published_date: '2026-11-12',
        type: 'Reportagem Especial',
        sentiment: 'positivo',
        reach: 98000,
        ave_value: 9200,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://publico.pt',
        summary: 'Artigo de meia página com infografia comparativa e citação do Diretor de Sustentabilidade.'
      },
      {
        id: 'clip-3',
        title: 'Resultados da Holdings SA batem recorde impulsionados por exportações',
        outlet_name: 'Jornal de Negócios',
        journalist_name: 'Ana Bento',
        published_date: '2026-11-10',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 65000,
        ave_value: 8400,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://jornaldenegocios.pt',
        summary: 'Abertura da secção de Mercados com elogios à disciplina operacional e crescimento no EBITDA.'
      },
      {
        id: 'clip-4',
        title: 'Novo polo tecnológico em Lisboa promete criar 500 postos de trabalho',
        outlet_name: 'ECO Economia Online',
        journalist_name: 'Pedro Ramos',
        published_date: '2026-11-08',
        type: 'Notícia Online',
        sentiment: 'positivo',
        reach: 140000,
        ave_value: 7100,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://eco.sapo.pt',
        summary: 'Destaque no topo do portal com galeria fotográfica das novas instalações do Hub.'
      },
      {
        id: 'clip-5',
        title: 'Como a inovação portuguesa está a liderar a transição verde na Europa',
        outlet_name: 'Observador',
        journalist_name: 'Tiago Sousa',
        published_date: '2026-11-06',
        type: 'Artigo de Análise',
        sentiment: 'positivo',
        reach: 110000,
        ave_value: 6500,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://observador.pt',
        summary: 'Caso de estudo GreenCorp destacado como exemplo de boas práticas industriais.'
      },
      {
        id: 'clip-6',
        title: 'Entrevista em estúdio: A visão de expansão ibérica para os próximos 5 anos',
        outlet_name: 'SIC Notícias',
        journalist_name: 'Sofia Martins',
        published_date: '2026-11-15',
        type: 'Entrevista Televisiva',
        sentiment: 'positivo',
        reach: 220000,
        ave_value: 12000,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://sicnoticias.pt',
        summary: 'Entrevista de 8 minutos no Jornal da Tarde com alta repercussão mediática.'
      },
      {
        id: 'clip-7',
        title: 'Tech Hub abre portas no Beato com foco em IA e energias limpas',
        outlet_name: 'RTP Informação',
        journalist_name: 'Inês Carvalho',
        published_date: '2026-11-05',
        type: 'Reportagem TV',
        sentiment: 'positivo',
        reach: 180000,
        ave_value: 8800,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://rtp.pt',
        summary: 'Peça no Telejornal com imagens das bancadas laboratoriais e declarações de fundadores.'
      },
      {
        id: 'clip-8',
        title: 'PharmaPlus lança gama inovadora com chancela de investigação nacional',
        outlet_name: 'Dinheiro Vivo',
        journalist_name: 'Miguel Costa',
        published_date: '2026-11-03',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 45000,
        ave_value: 4300,
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        collaborator: 'Helena Ramos',
        article_url: 'https://dinheirovivo.pt',
        summary: 'Destaque no suplemento de domingo sobre inovação farmacêutica.'
      },
      {
        id: 'clip-9',
        title: 'Tendências de liderança institucional e relações públicas modernas',
        outlet_name: 'Executive Digest',
        journalist_name: 'Redação',
        published_date: '2026-11-02',
        type: 'Artigo de Opinião',
        sentiment: 'positivo',
        reach: 32000,
        ave_value: 3200,
        project_name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://executivedigest.sapo.pt',
        summary: 'Artigo assinado pela Direção de RP sobre reputação empresarial em tempos de incerteza.'
      },
      {
        id: 'clip-10',
        title: 'A estratégia de marca por trás do crescimento internacional do Grupo M',
        outlet_name: 'Marketeer',
        journalist_name: 'Catarina Silva',
        published_date: '2026-11-01',
        type: 'Caso de Estudo',
        sentiment: 'positivo',
        reach: 28000,
        ave_value: 2800,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://marketeer.sapo.pt',
        summary: 'Análise aprofundada da campanha de comunicação externa desenvolvida pela agência.'
      },
      {
        id: 'clip-11',
        title: 'Tecnologia verde: os bastidores do Tech Hub Lisboa',
        outlet_name: 'Exame Informática',
        journalist_name: 'Paulo Tomé',
        published_date: '2026-11-09',
        type: 'Reportagem',
        sentiment: 'positivo',
        reach: 35000,
        ave_value: 3100,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://visao.pt/exameinformatica',
        summary: 'Avaliação técnica das infraestruturas e parcerias com startups universitárias.'
      },
      {
        id: 'clip-12',
        title: 'Parcerias luso-espanholas ganham novo fôlego em 2026',
        outlet_name: 'Jornal Económico',
        journalist_name: 'André Santos',
        published_date: '2026-11-07',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 42000,
        ave_value: 4000,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Tiago Mendes',
        article_url: 'https://jornaleconomico.sapo.pt',
        summary: 'Mensão elogiosa à capacidade de atração de capital ibérico pelo Grupo M.'
      },

      // 5 NEUTRAS
      {
        id: 'clip-13',
        title: 'Holdings SA apresenta contas anuais na próxima semana',
        outlet_name: 'Agência Lusa',
        journalist_name: 'Despacho Geral',
        published_date: '2026-11-11',
        type: 'Despacho de Agência',
        sentiment: 'neutro',
        reach: 50000,
        ave_value: 1500,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://lusa.pt',
        summary: 'Nota factual de agenda com as datas previstas para a comunicação de mercado.'
      },
      {
        id: 'clip-14',
        title: 'Empresas nacionais reforçam presença no mercado vizinho',
        outlet_name: 'Diário de Notícias',
        journalist_name: 'Helena Bento',
        published_date: '2026-11-08',
        type: 'Notícia',
        sentiment: 'neutro',
        reach: 40000,
        ave_value: 2200,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://dn.pt',
        summary: 'Panorama setorial citando o Grupo M a par de outros dois operadores ibéricos.'
      },
      {
        id: 'clip-15',
        title: 'Debate matinal sobre metas de descarbonização da indústria',
        outlet_name: 'Antena 1',
        journalist_name: 'Luísa Vieira',
        published_date: '2026-11-04',
        type: 'Mensão Rádio',
        sentiment: 'neutro',
        reach: 60000,
        ave_value: 2000,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://rtp.pt/play/antena1',
        summary: 'Referência ao compromisso assumido pela GreenCorp durante debate de atualidade.'
      },
      {
        id: 'clip-16',
        title: 'Balanço das novas aberturas no setor farmacêutico',
        outlet_name: 'Rádio Renascença',
        journalist_name: 'Noticiário',
        published_date: '2026-11-02',
        type: 'Nota Breve',
        sentiment: 'neutro',
        reach: 30000,
        ave_value: 1200,
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        collaborator: 'Helena Ramos',
        article_url: 'https://rr.sapo.pt',
        summary: 'Notícia síntese com a lista de novas autorizações de distribuição do Infarmed.'
      },
      {
        id: 'clip-17',
        title: 'Panorama dos polos de inovação da capital portuguesa',
        outlet_name: 'Visão',
        journalist_name: 'Clara Nogueira',
        published_date: '2026-11-01',
        type: 'Artigo Panorama',
        sentiment: 'neutro',
        reach: 35000,
        ave_value: 1800,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://visao.pt',
        summary: 'Levantamento descritivo dos espaços co-work e hubs tecnológicos ativos em Lisboa.'
      },

      // 1 NEGATIVA
      {
        id: 'clip-18',
        title: 'Setor alerta para atrasos burocráticos nos licenciamentos de novas fábricas',
        outlet_name: 'Correio da Manhã',
        journalist_name: 'Redação Economia',
        published_date: '2026-11-13',
        type: 'Notícia de Crítica',
        sentiment: 'negativo',
        reach: 85000,
        ave_value: 1200,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://cmjornal.pt',
        summary: 'Artigo abordando queixas de atrasos em obras industriais com citação indireta à Holdings SA.'
      }
    ];
