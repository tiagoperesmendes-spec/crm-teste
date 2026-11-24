$files = @("dashboard.html", "index.html")

# 1. Sidebar button to insert right after nav-tasks
$sidebarButton = @'
          <!-- 4. Comunicação (Mural de Anúncios & Chat) -->
          <button onclick="switchView('communication')" id="nav-communication"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>Comunicação</span>
            </div>
            <span id="sidebar-comm-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full">3</span>
          </button>
'@

# 2. View markup to insert right after view-outlets (before view-project-detail)
$commViewMarkup = @'

      <!-- ======================================================== -->
      <!-- VISTA 6: COMUNICAÇÃO (MURAL DA DIREÇÃO & CHAT DA EQUIPA) -->
      <!-- ======================================================== -->
      <div id="view-communication"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Topo da página: Título + Resumo calculado + Botão Novo Anúncio (Diretor) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-baseline gap-3 flex-wrap">
            <h1 class="text-2xl font-bold font-title text-[#1A1A1A] tracking-tight">Comunicação</h1>
            <span id="comm-summary-text" class="text-xs text-[#6B6B6B] font-normal">3 anúncios da direção · 4 mensagens no chat</span>
          </div>
          <div class="flex items-center gap-2.5">
            <button onclick="openAnnouncementModal()" id="btn-open-announcement-modal"
              class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
              <span>+ Novo anúncio</span>
            </button>
          </div>
        </div>

        <!-- Separadores por Secção: Mural da Direção vs Chat da Equipa -->
        <div class="border-b border-[#E4DDD3]/70 pt-1">
          <div class="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs">
            <button type="button" onclick="setCommTab('announcements')" id="comm-tab-announcements"
              class="comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0">
              <span>Mural da Direção</span>
              <span id="comm-count-announcements" class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white">3</span>
            </button>
            <button type="button" onclick="setCommTab('chat')" id="comm-tab-chat"
              class="comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>Chat da Equipa</span>
              <span id="comm-count-chat" class="text-[11px] font-normal text-[#8A8A8A]">4</span>
            </button>
          </div>
        </div>

        <!-- SECÇÃO 1: MURAL DA DIREÇÃO -->
        <div id="comm-content-announcements" class="space-y-4">
          <!-- Barra de Pesquisa de Anúncios -->
          <div class="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E4DDD3] shadow-xs flex items-center">
            <div class="relative flex-1">
              <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" id="search-announcements" oninput="renderAnnouncementsList()"
                placeholder="Pesquisar comunicados e anúncios da direção..."
                class="crm-input pl-9 pr-3 py-1.5 text-xs w-full bg-[#FAF8F5] border-[#E8E2D8] focus:bg-white">
            </div>
          </div>

          <!-- Feed de Anúncios -->
          <div id="announcements-feed-container" class="space-y-4">
            <!-- Preenchido dinamicamente por renderAnnouncementsList() -->
          </div>
        </div>

        <!-- SECÇÃO 2: CHAT DA EQUIPA -->
        <div id="comm-content-chat" class="hidden space-y-4">
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-card overflow-hidden flex flex-col">
            <!-- Topo do Chat -->
            <div class="p-4 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-2.5 h-2.5 rounded-full bg-[#2F6B3A]"></div>
                <div>
                  <h3 class="text-xs font-semibold text-[#1A1A1A] font-title">Canal Geral da Agência</h3>
                  <p class="text-[11px] text-[#6B6B6B]">Colaboradores com acesso ativo: Tiago Mendes (Diretor), Leonor Rodrigues (Técnica)</p>
                </div>
              </div>
              <span class="text-[11px] text-[#8A8A8A] font-medium hidden sm:inline">Mensagens em direto</span>
            </div>

            <!-- Área de Mensagens com Scroll -->
            <div id="team-chat-messages" class="h-[460px] overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF8F5]/60">
              <!-- Preenchido dinamicamente por renderTeamChat() -->
            </div>

            <!-- Barra de Envio de Mensagens -->
            <div class="p-3.5 sm:p-4 bg-white border-t border-[#E4DDD3]">
              <div id="chat-input-container" class="flex items-center gap-2.5">
                <input type="text" id="team-chat-input"
                  placeholder="Escreve uma mensagem para a equipa... (pressiona Enter para enviar)"
                  onkeydown="handleChatInputKeyDown(event)"
                  class="crm-input py-2.5 px-3.5 text-xs flex-1 bg-white border-[#E4DDD3] focus:border-[#6C1C37]">
                <button type="button" onclick="sendChatMessage()" id="btn-send-chat"
                  class="btn-primary py-2.5 px-4 text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer">
                  <span>Enviar</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
              <p id="chat-viewer-notice" class="hidden text-[11px] text-[#8A8A8A] mt-2 italic text-center">
                Modo Observador: O seu perfil tem acesso exclusivo de consulta e não pode enviar mensagens.
              </p>
            </div>
          </div>
        </div>

      </div>
'@

# 3. Modal markup to insert right after panel-outlet-detail
$annModalMarkup = @'

  <!-- ======================================================== -->
  <!-- JANELA MODAL: NOVO ANÚNCIO DA DIREÇÃO                     -->
  <!-- ======================================================== -->
  <div id="modal-announcement"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
    <div
      class="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
      <!-- Cabeçalho -->
      <div class="px-6 py-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-base font-bold text-[#1A1A1A] font-title">Novo Anúncio da Direção</h3>
          <p class="text-xs text-[#6B6B6B] mt-0.5">Publica uma diretiva ou aviso oficial para a equipa.</p>
        </div>
        <button onclick="closeAnnouncementModal()" class="text-[#8A8A8A] hover:text-[#1A1A1A] p-1.5 rounded-lg transition-colors cursor-pointer" title="Fechar (Esc)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Formulário -->
      <form onsubmit="handleCreateAnnouncement(event)" class="p-6 space-y-4 overflow-y-auto">
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1.5">Título do Anúncio *</label>
          <input type="text" id="announcement-title-input" required placeholder="Ex: Alinhamento de Campanhas Q4"
            class="crm-input py-2 px-3 text-xs w-full">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1.5">Prioridade / Categoria *</label>
            <select id="announcement-priority-select" class="crm-select text-xs py-2 px-3 w-full bg-white border-[#E4DDD3] rounded-xl text-[#1A1A1A]">
              <option value="geral" selected>Geral (Informativo)</option>
              <option value="importante">Importante (Atenção)</option>
              <option value="urgente">Urgente (Ação Imediata)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1.5">Destinatários</label>
            <select id="announcement-target-select" class="crm-select text-xs py-2 px-3 w-full bg-white border-[#E4DDD3] rounded-xl text-[#1A1A1A]">
              <option value="all" selected>Toda a Agência</option>
              <option value="tech">Técnicos de Comunicação</option>
              <option value="press">Assessores de Imprensa</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1.5">Conteúdo do Anúncio *</label>
          <textarea id="announcement-content-input" required rows="5"
            placeholder="Escreve o texto completo do anúncio ou diretiva..."
            class="crm-input py-2 px-3 text-xs w-full leading-relaxed"></textarea>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="announcement-pinned-checkbox" checked
            class="rounded border-[#D1C7BA] text-[#6C1C37] focus:ring-[#6C1C37] cursor-pointer">
          <label for="announcement-pinned-checkbox" class="text-xs text-[#1A1A1A] cursor-pointer select-none">
            Fixar este anúncio no topo do mural
          </label>
        </div>

        <!-- Rodapé do Modal -->
        <div class="pt-4 border-t border-[#E4DDD3] flex items-center justify-between">
          <span class="text-[11px] text-[#6B6B6B]">Emitido por: <strong>Tiago Mendes (Diretor)</strong></span>
          <div class="flex items-center gap-2">
            <button type="button" onclick="closeAnnouncementModal()" class="btn-secondary py-2 px-3 text-xs">
              Cancelar
            </button>
            <button type="submit" class="btn-primary py-2 px-4 text-xs font-medium shadow-xs">
              Publicar Anúncio
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
'@

# 4. JS code for Comunicação
$commJsLogic = @'

    // ========================================================
    // MÓDULO DE COMUNICAÇÃO (MURAL DA DIREÇÃO & CHAT DA EQUIPA)
    // ========================================================
    const INITIAL_ANNOUNCEMENTS = [
      {
        id: 'ann-1',
        title: 'Alinhamento Estratégico & Fecho de Campanhas Q4',
        priority: 'importante',
        target: 'all',
        pinned: true,
        author: 'Tiago Mendes',
        role: 'Diretor Geral',
        date: '2026-11-24T09:30:00Z',
        content: 'Caros colaboradores,\n\nRelembro que até ao final desta semana temos de fechar todos os relatórios de clipping do projeto Fundo Ibérico e validar os contactos de follow-up com os editores de economia (ECO e Jornal de Negócios).\n\nReunião de alinhamento geral na sexta-feira às 10:00 no gabinete principal.'
      },
      {
        id: 'ann-2',
        title: 'Atualização Obrigatória das Fichas de Meios e Jornalistas',
        priority: 'geral',
        target: 'all',
        pinned: false,
        author: 'Tiago Mendes',
        role: 'Diretor Geral',
        date: '2026-11-23T15:00:00Z',
        content: 'Aviso a toda a equipa que qualquer alteração de cargos ou saídas de redações deve ser registada de imediato nas respetivas fichas de jornalistas e meios no CRM para garantir a fiabilidade dos nossos envios.'
      },
      {
        id: 'ann-3',
        title: 'Protocolo de Contacto em Situações de Gestão de Crise',
        priority: 'urgente',
        target: 'all',
        pinned: true,
        author: 'Tiago Mendes',
        role: 'Diretor Geral',
        date: '2026-11-22T11:20:00Z',
        content: 'Qualquer abordagem de jornalistas ou pedidos de esclarecimento referentes aos clientes em monitorização de crise devem ser imediatamente reencaminhados para a Direção antes de qualquer declaração preliminar.'
      }
    ];

    const INITIAL_TEAM_MESSAGES = [
      {
        id: 'msg-1',
        author: 'Leonor Rodrigues',
        email: 'leonor.rp.faculdade@gmail.com',
        role: 'Técnica de Comunicação',
        timestamp: '2026-11-24T10:15:00Z',
        text: 'Bom dia equipa! Já enviei a nota de imprensa revista sobre o Lançamento do Fundo Ibérico para os editores da Lusa e do ECO.'
      },
      {
        id: 'msg-2',
        author: 'Tiago Mendes',
        email: 'tiagoperesmendes@gmail.com',
        role: 'Diretor Geral',
        timestamp: '2026-11-24T10:22:00Z',
        text: 'Excelente trabalho, Leonor. Por favor acompanha a confirmação de receção com o Nuno Abreu no ECO antes das 15h.'
      },
      {
        id: 'msg-3',
        author: 'Leonor Rodrigues',
        email: 'leonor.rp.faculdade@gmail.com',
        role: 'Técnica de Comunicação',
        timestamp: '2026-11-24T10:25:00Z',
        text: 'Combinado, já tenho a tarefa de contacto agendada no diário de tarefas para o início da tarde.'
      },
      {
        id: 'msg-4',
        author: 'Tiago Mendes',
        email: 'tiagoperesmendes@gmail.com',
        role: 'Diretor Geral',
        timestamp: '2026-11-24T11:05:00Z',
        text: 'Perfeito. Se precisares de validação das declarações do porta-voz, estou disponível no gabinete.'
      }
    ];

    let localAnnouncements = [];
    let localTeamMessages = [];
    let currentCommTab = 'announcements';

    function initCommunicationData() {
      const savedAnn = localStorage.getItem('rep_announcements');
      if (savedAnn) {
        try { localAnnouncements = JSON.parse(savedAnn); } catch(e) { localAnnouncements = [...INITIAL_ANNOUNCEMENTS]; }
      } else {
        localAnnouncements = [...INITIAL_ANNOUNCEMENTS];
      }

      const savedMsgs = localStorage.getItem('rep_team_messages');
      if (savedMsgs) {
        try { localTeamMessages = JSON.parse(savedMsgs); } catch(e) { localTeamMessages = [...INITIAL_TEAM_MESSAGES]; }
      } else {
        localTeamMessages = [...INITIAL_TEAM_MESSAGES];
      }
    }

    function syncCommunicationStorage() {
      localStorage.setItem('rep_announcements', JSON.stringify(localAnnouncements));
      localStorage.setItem('rep_team_messages', JSON.stringify(localTeamMessages));
      updateCommunicationCounts();
    }

    function updateCommunicationCounts() {
      const countEl = document.getElementById('comm-count-announcements');
      if (countEl) countEl.innerText = localAnnouncements.length;
      const countChatEl = document.getElementById('comm-count-chat');
      if (countChatEl) countChatEl.innerText = localTeamMessages.length;
      const sideCommEl = document.getElementById('sidebar-comm-count');
      if (sideCommEl) sideCommEl.innerText = localAnnouncements.length;

      const sumEl = document.getElementById('comm-summary-text');
      if (sumEl) {
        sumEl.innerText = `${localAnnouncements.length} anúncios da direção · ${localTeamMessages.length} mensagens no chat`;
      }
    }

    function setCommTab(tab) {
      currentCommTab = tab;
      const tabAnn = document.getElementById('comm-tab-announcements');
      const tabChat = document.getElementById('comm-tab-chat');
      const secAnn = document.getElementById('comm-content-announcements');
      const secChat = document.getElementById('comm-content-chat');

      if (tab === 'announcements') {
        if (tabAnn) {
          tabAnn.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0";
          const countBadge = tabAnn.querySelector('span:last-child');
          if (countBadge) countBadge.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white";
        }
        if (tabChat) {
          tabChat.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0";
          const countBadge = tabChat.querySelector('span:last-child');
          if (countBadge) countBadge.className = "text-[11px] font-normal text-[#8A8A8A]";
        }
        if (secAnn) secAnn.classList.remove('hidden');
        if (secChat) secChat.classList.add('hidden');
        renderAnnouncementsList();
      } else {
        if (tabChat) {
          tabChat.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0";
          const countBadge = tabChat.querySelector('span:last-child');
          if (countBadge) countBadge.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white";
        }
        if (tabAnn) {
          tabAnn.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0";
          const countBadge = tabAnn.querySelector('span:last-child');
          if (countBadge) countBadge.className = "text-[11px] font-normal text-[#8A8A8A]";
        }
        if (secAnn) secAnn.classList.add('hidden');
        if (secChat) secChat.classList.remove('hidden');
        renderTeamChat();
      }
    }

    function renderCommunicationView() {
      initCommunicationData();
      updateCommunicationCounts();

      // Ajustar permissões da barra de ações
      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));
      const btnNewAnn = document.getElementById('btn-open-announcement-modal');
      if (btnNewAnn) {
        btnNewAnn.style.display = isDirector ? 'flex' : 'none';
      }

      const isViewer = (currentUser?.user_metadata?.role === 'viewer') || ((currentUser?.email || '').toLowerCase().includes('ps4'));
      const chatInput = document.getElementById('team-chat-input');
      const btnSend = document.getElementById('btn-send-chat');
      const viewerNotice = document.getElementById('chat-viewer-notice');
      if (isViewer) {
        if (chatInput) {
          chatInput.disabled = true;
          chatInput.placeholder = "Modo Observador: O seu perfil tem acesso exclusivo de consulta.";
        }
        if (btnSend) btnSend.disabled = true;
        if (viewerNotice) viewerNotice.classList.remove('hidden');
      } else {
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.placeholder = "Escreve uma mensagem para a equipa... (pressiona Enter para enviar)";
        }
        if (btnSend) btnSend.disabled = false;
        if (viewerNotice) viewerNotice.classList.add('hidden');
      }

      if (currentCommTab === 'chat') {
        renderTeamChat();
      } else {
        renderAnnouncementsList();
      }
    }

    function renderAnnouncementsList() {
      const container = document.getElementById('announcements-feed-container');
      if (!container) return;

      const q = (document.getElementById('search-announcements')?.value || '').toLowerCase().trim();
      let list = [...localAnnouncements];

      if (q) {
        list = list.filter(a =>
          (a.title || '').toLowerCase().includes(q) ||
          (a.content || '').toLowerCase().includes(q) ||
          (a.priority || '').toLowerCase().includes(q)
        );
      }

      // Ordenar: Fixados primeiro, depois por data decrescente
      list.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center bg-white rounded-2xl border border-[#E4DDD3] text-[#6B6B6B]">
            <p class="text-xs">Nenhum anúncio encontrado com estes critérios.</p>
          </div>
        `;
        return;
      }

      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));

      container.innerHTML = list.map(ann => {
        let tagColor = 'bg-[#DDE6EE] text-[#2F4A63] border-[#C8D7E6]';
        let tagLabel = 'Geral';
        if (ann.priority === 'urgente') {
          tagColor = 'bg-[#F6D9D5] text-[#A3281E] border-[#F1D9CE]';
          tagLabel = 'Urgente';
        } else if (ann.priority === 'importante') {
          tagColor = 'bg-[#F7E7BF] text-[#805B00] border-[#EED9A0]';
          tagLabel = 'Importante';
        }

        const dateStr = formatCommDate(ann.date);

        return `
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs p-5 sm:p-6 space-y-4 hover:border-[#6C1C37]/30 transition-all">
            <!-- Cabeçalho do Anúncio -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs font-title shrink-0 shadow-2xs">
                  TM
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-semibold text-[#1A1A1A]">${ann.author || 'Tiago Mendes'}</span>
                    <span class="text-[11px] text-[#6B6B6B]">(${ann.role || 'Diretor Geral'})</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${tagColor}">
                      ${tagLabel}
                    </span>
                    ${ann.pinned ? `
                      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6C1C37] bg-[#E6C5CA]/30 border border-[#E6C5CA] px-2 py-0.5 rounded-full">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        Fixado
                      </span>
                    ` : ''}
                  </div>
                  <span class="text-[11px] text-[#8A8A8A] mt-0.5 block">${dateStr}</span>
                </div>
              </div>

              ${isDirector ? `
                <button type="button" onclick="deleteAnnouncement('${ann.id}')"
                  class="self-end sm:self-auto text-xs text-[#A3281E] hover:underline px-2 py-1 rounded-lg hover:bg-[#FBEAE8] transition-colors cursor-pointer" title="Eliminar este anúncio">
                  Eliminar anúncio
                </button>
              ` : ''}
            </div>

            <!-- Título do Anúncio -->
            <h2 class="text-base sm:text-lg font-bold font-title text-[#1A1A1A] tracking-tight">
              ${escapeHtml(ann.title)}
            </h2>

            <!-- Conteúdo formatado com parágrafos limpos -->
            <div class="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8]">
              ${escapeHtml(ann.content)}
            </div>

            <!-- Rodapé do Cartão de Anúncio -->
            <div class="pt-2 flex items-center justify-between text-[11px] text-[#8A8A8A] border-t border-[#E4DDD3]/60">
              <span>Destinatários: <strong>${ann.target === 'tech' ? 'Técnicos de Comunicação' : (ann.target === 'press' ? 'Assessores de Imprensa' : 'Toda a Agência MODO')}</strong></span>
              <span class="text-[10px] uppercase font-semibold tracking-wider text-[#6C1C37]">Diretiva Oficial MODO</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function formatCommDate(isoStr) {
      if (!isoStr) return 'Hoje';
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      if (isToday) {
        return `Hoje às ${hours}:${minutes}`;
      }
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year} às ${hours}:${minutes}`;
    }

    function openAnnouncementModal() {
      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));
      if (!isDirector) {
        showToast('Acesso Restrito: A publicação de comunicados oficiais é reservada ao Diretor Geral.');
        return;
      }
      const modal = document.getElementById('modal-announcement');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        const titleInput = document.getElementById('announcement-title-input');
        if (titleInput) {
          titleInput.value = '';
          titleInput.focus();
        }
        const contentInput = document.getElementById('announcement-content-input');
        if (contentInput) contentInput.value = '';
      }
    }

    function closeAnnouncementModal() {
      const modal = document.getElementById('modal-announcement');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }

    function handleCreateAnnouncement(e) {
      e.preventDefault();
      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));
      if (!isDirector) {
        showToast('Acesso Restrito: Apenas o Diretor pode publicar anúncios.');
        closeAnnouncementModal();
        return;
      }

      const title = (document.getElementById('announcement-title-input')?.value || '').trim();
      const priority = document.getElementById('announcement-priority-select')?.value || 'geral';
      const target = document.getElementById('announcement-target-select')?.value || 'all';
      const content = (document.getElementById('announcement-content-input')?.value || '').trim();
      const pinned = document.getElementById('announcement-pinned-checkbox')?.checked || false;

      if (!title || !content) {
        alert('Por favor preenche o título e o conteúdo do anúncio.');
        return;
      }

      const newAnn = {
        id: 'ann-' + Date.now(),
        title: title,
        priority: priority,
        target: target,
        content: content,
        pinned: pinned,
        author: currentUser?.name || currentUser?.user_metadata?.full_name || 'Tiago Mendes',
        role: 'Diretor Geral',
        date: new Date().toISOString()
      };

      localAnnouncements.unshift(newAnn);
      syncCommunicationStorage();
      closeAnnouncementModal();
      setCommTab('announcements');
      showToast('Anúncio publicado no mural da direção com sucesso.');
    }

    function deleteAnnouncement(annId) {
      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));
      if (!isDirector) {
        showToast('Apenas o Diretor pode eliminar anúncios.');
        return;
      }

      if (!confirm('Tem a certeza que deseja eliminar este anúncio da direção?')) return;

      localAnnouncements = localAnnouncements.filter(a => a.id !== annId);
      syncCommunicationStorage();
      renderAnnouncementsList();
      showToast('Anúncio eliminado com sucesso.');
    }

    function renderTeamChat() {
      const box = document.getElementById('team-chat-messages');
      if (!box) return;

      if (localTeamMessages.length === 0) {
        box.innerHTML = `
          <div class="h-full flex items-center justify-center text-xs text-[#6B6B6B]">
            <p>Ainda não existem mensagens no chat. Envia a primeira mensagem abaixo.</p>
          </div>
        `;
        return;
      }

      const currentEmail = (currentUser?.email || '').toLowerCase();
      const isDirector = (currentUser?.user_metadata?.role === 'director') || currentEmail.includes('tiagoperesmendes@gmail.com');

      box.innerHTML = localTeamMessages.map(msg => {
        const msgEmail = (msg.email || '').toLowerCase();
        const isMine = currentEmail && (msgEmail === currentEmail);
        const timeStr = formatCommDate(msg.timestamp);

        let initials = 'TM';
        let avatarBg = 'bg-[#6C1C37]';
        if (msgEmail.includes('leonor') || (msg.author && msg.author.toLowerCase().includes('leonor'))) {
          initials = 'LR';
          avatarBg = 'bg-[#3F5A2E]';
        } else if (msgEmail.includes('ps4') || (msg.author && msg.author.toLowerCase().includes('convidado'))) {
          initials = 'TC';
          avatarBg = 'bg-[#5C554E]';
        }

        return `
          <div class="flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''} group">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full ${avatarBg} text-white flex items-center justify-center text-xs font-semibold shrink-0 font-title shadow-2xs">
              ${initials}
            </div>

            <!-- Corpo da Mensagem -->
            <div class="max-w-[85%] sm:max-w-xl space-y-1">
              <div class="flex items-center gap-2 ${isMine ? 'justify-end' : ''}">
                <span class="text-xs font-semibold text-[#1A1A1A]">${isMine ? 'Tu (' + msg.author + ')' : msg.author}</span>
                <span class="text-[10px] text-[#6B6B6B]">(${msg.role || 'Colaborador'})</span>
                <span class="text-[10px] text-[#8A8A8A]">${timeStr}</span>
                ${(isMine || isDirector) ? `
                  <button type="button" onclick="deleteChatMessage('${msg.id}')"
                    class="opacity-0 group-hover:opacity-100 text-[10px] text-[#A3281E] hover:underline transition-opacity ml-1" title="Eliminar mensagem">
                    Eliminar
                  </button>
                ` : ''}
              </div>

              <div class="p-3.5 rounded-2xl text-xs sm:text-xs leading-relaxed ${isMine ? 'bg-[#FFFFFF] border-2 border-[#6C1C37]/30 text-[#1A1A1A] shadow-xs' : 'bg-white border border-[#E4DDD3] text-[#1A1A1A] shadow-2xs'}">
                ${escapeHtml(msg.text)}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Auto-scroll para a última mensagem
      setTimeout(() => {
        box.scrollTop = box.scrollHeight;
      }, 50);
    }

    function handleChatInputKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
      }
    }

    function sendChatMessage() {
      const isViewer = (currentUser?.user_metadata?.role === 'viewer') || ((currentUser?.email || '').toLowerCase().includes('ps4'));
      if (isViewer) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      const input = document.getElementById('team-chat-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const userEmail = (currentUser?.email || 'tiagoperesmendes@gmail.com').toLowerCase();
      let authorName = currentUser?.name || currentUser?.user_metadata?.full_name || 'Tiago Mendes';
      let roleTitle = 'Diretor Geral';

      if (userEmail.includes('leonor')) {
        authorName = 'Leonor Rodrigues';
        roleTitle = 'Técnica de Comunicação';
      }

      const newMsg = {
        id: 'msg-' + Date.now(),
        author: authorName,
        email: userEmail,
        role: roleTitle,
        timestamp: new Date().toISOString(),
        text: text
      };

      localTeamMessages.push(newMsg);
      syncCommunicationStorage();
      input.value = '';
      renderTeamChat();
    }

    function deleteChatMessage(msgId) {
      if (!confirm('Deseja eliminar esta mensagem do chat?')) return;
      localTeamMessages = localTeamMessages.filter(m => m.id !== msgId);
      syncCommunicationStorage();
      renderTeamChat();
    }
'@

foreach ($file in $files) {
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # A. Add button to sidebar right after nav-tasks
    $taskBtnPattern = '(<button onclick="switchView\(''tasks''\)" id="nav-tasks"[\s\S]*?</button>)'
    if ($content -match $taskBtnPattern -and -not $content.Contains('id="nav-communication"')) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $taskBtnPattern, "`$1`n" + $sidebarButton)
        Write-Output "Added nav-communication to sidebar in $file"
    }

    # B. Add view-communication right after view-outlets (before view-project-detail)
    $viewOutletsEndPattern = '(<!-- Tabela de Meios: 6 Colunas \+ Menu ⋯ -->[\s\S]*?</div>\s*</div>)'
    $targetMarker = '<!-- VISTA 5: FICHA DO PROJETO (view-project-detail) -->'
    if ($content.Contains($targetMarker) -and -not $content.Contains('id="view-communication"')) {
        $content = $content.Replace($targetMarker, $commViewMarkup + "`n`n      " + $targetMarker)
        Write-Output "Added view-communication markup in $file"
    }

    # C. Add modal-announcement right before modal-new-task
    $modalTaskMarker = '<!-- MODAL: NOVA TAREFA -->'
    if ($content.Contains($modalTaskMarker) -and -not $content.Contains('id="modal-announcement"')) {
        $content = $content.Replace($modalTaskMarker, $annModalMarkup + "`n`n  " + $modalTaskMarker)
        Write-Output "Added modal-announcement in $file"
    }

    # D. Update switchView validViews, allViewIds, navIds
    if ($content.Contains("'outlets']")) {
        $content = $content.Replace("'outlets']", "'outlets', 'communication']")
        Write-Output "Updated validViews in $file"
    }
    if ($content.Contains("'view-outlets'")) {
        $content = $content.Replace("'view-outlets'", "'view-outlets', 'view-communication'")
        Write-Output "Updated allViewIds in $file"
    }
    if ($content.Contains("'nav-outlets']")) {
        $content = $content.Replace("'nav-outlets']", "'nav-outlets', 'nav-communication']")
        Write-Output "Updated navIds in $file"
    }

    # In switchView handler, add viewName === 'communication'
    $outletsSwitchHandler = @'
      } else if (viewName === 'outlets') {
        document.getElementById('view-outlets').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Meios";
        document.getElementById('page-subtitle').innerText = "Registo de redações, moradas, grupos de media, registo ERC e formatos.";
        renderOutletsTable();
'@
    $commSwitchHandler = @'
      } else if (viewName === 'outlets') {
        document.getElementById('view-outlets').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Meios";
        document.getElementById('page-subtitle').innerText = "Registo de redações, moradas, grupos de media, registo ERC e formatos.";
        renderOutletsTable();
      } else if (viewName === 'communication') {
        document.getElementById('view-communication').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Comunicação";
        document.getElementById('page-subtitle').innerText = "Mural de avisos da direção e mensagens entre a equipa.";
        renderCommunicationView();
'@

    if ($content.Contains($outletsSwitchHandler) -and -not $content.Contains("viewName === 'communication'")) {
        $content = $content.Replace($outletsSwitchHandler, $commSwitchHandler)
        Write-Output "Added switchView branch for communication in $file"
    }

    # E. Update updateSidebarCounts and updateKpis
    $kpiAnchor = 'if (sidebarTasks) sidebarTasks.innerText = pendingTasksCount;'
    $kpiAddition = "if (sidebarTasks) sidebarTasks.innerText = pendingTasksCount;`n        const sidebarComm = document.getElementById('sidebar-comm-count'); if (sidebarComm) sidebarComm.innerText = (localAnnouncements || []).length;"
    if ($content.Contains($kpiAnchor) -and -not $content.Contains("sidebarComm.innerText")) {
        $content = $content.Replace($kpiAnchor, $kpiAddition)
        Write-Output "Updated updateKpis for communication in $file"
    }

    $sidebarCountAnchor = 'const oCount = document.getElementById(''sidebar-outlets-count'');'
    $sidebarCountAddition = "const oCount = document.getElementById('sidebar-outlets-count');`n        const cCount = document.getElementById('sidebar-comm-count'); if (cCount) cCount.innerText = (localAnnouncements || []).length;"
    if ($content.Contains($sidebarCountAnchor) -and -not $content.Contains("cCount.innerText")) {
        $content = $content.Replace($sidebarCountAnchor, $sidebarCountAddition)
        Write-Output "Updated updateSidebarCounts for communication in $file"
    }

    # F. Insert JS logic before handleDashboardSearch
    $dashSearchMarker = '// PESQUISA GLOBAL FUNCIONAL DA DASHBOARD'
    if ($content.Contains($dashSearchMarker) -and -not $content.Contains('function initCommunicationData()')) {
        $content = $content.Replace($dashSearchMarker, $commJsLogic + "`n`n    " + $dashSearchMarker)
        Write-Output "Added communication JS logic in $file"
    }

    # Also in loadAllData(), initialize communication data
    $loadAllAnchor = 'loadAllData() {'
    if ($content.Contains($loadAllAnchor) -and -not $content.Contains('initCommunicationData();')) {
        $content = $content.Replace($loadAllAnchor, "loadAllData() {`n      initCommunicationData();")
        Write-Output "Added initCommunicationData() call in loadAllData() in $file"
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
