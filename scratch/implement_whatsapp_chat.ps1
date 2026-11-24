$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

# The WhatsApp-style HTML structure for #comm-content-chat
$whatsappChatHtml = @'
        <!-- SECÇÃO 2: CHAT ESTILO WHATSAPP (CONVERSAS DIRETAS & CANAL GERAL) -->
        <div id="comm-content-chat" class="hidden space-y-4">
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-card overflow-hidden flex flex-col md:flex-row h-[620px]">
            
            <!-- COLUNA ESQUERDA: LISTA DE CONTACTOS / CONVERSAS -->
            <div id="chat-sidebar-panel" class="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#E4DDD3] flex flex-col bg-[#FBF9F6]/80 shrink-0">
              <!-- Topo da lista: Pesquisa de Colegas -->
              <div class="p-3.5 border-b border-[#E4DDD3] bg-[#FBF9F6] space-y-2.5">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-bold text-[#1A1A1A] font-title uppercase tracking-wider">Conversas</h3>
                  <span class="text-[10px] text-[#6B6B6B] bg-[#E9E5E0] px-2 py-0.5 rounded-full font-medium" id="chat-active-count">5 contactos</span>
                </div>
                <div class="relative">
                  <svg class="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input type="text" id="chat-search-contacts" placeholder="Pesquisar colega ou conversa..."
                    oninput="filterChatContacts(this.value)"
                    class="crm-input pl-8 pr-3 py-1.5 text-xs w-full bg-white border-[#E4DDD3] rounded-xl focus:bg-white placeholder-[#8A8A8A]">
                </div>
              </div>

              <!-- Lista de Conversas com Scroll -->
              <div id="chat-contacts-list" class="flex-1 overflow-y-auto divide-y divide-[#E4DDD3]/50">
                <!-- Preenchido dinamicamente por renderChatContactsList() -->
              </div>
            </div>

            <!-- COLUNA DIREITA: JANELA DA CONVERSA SELECIONADA -->
            <div id="chat-conversation-panel" class="flex-1 flex flex-col bg-white min-w-0">
              <!-- Topo da Conversa Ativa -->
              <div class="px-4 py-3 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Botão Voltar (Mobile) -->
                  <button type="button" onclick="showChatSidebarMobile()" class="md:hidden text-[#6B6B6B] hover:text-[#1A1A1A] p-1 -ml-1 rounded-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>

                  <!-- Avatar Ativo -->
                  <div class="relative shrink-0">
                    <div id="active-chat-avatar" class="w-9 h-9 rounded-full bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs font-title shadow-2xs">
                      GE
                    </div>
                    <span id="active-chat-online-dot" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2F6B3A] border-2 border-white rounded-full"></span>
                  </div>

                  <div class="min-w-0">
                    <h3 id="active-chat-name" class="text-xs font-semibold text-[#1A1A1A] font-title truncate">Canal Geral (Equipa MODO)</h3>
                    <p id="active-chat-role" class="text-[11px] text-[#6B6B6B] truncate">Toda a Agência · 5 membros ativos</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span id="active-chat-status-badge" class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#2F6B3A]"></span>
                    <span>Online agora</span>
                  </span>
                </div>
              </div>

              <!-- Área de Mensagens com Scroll (Estilo WhatsApp) -->
              <div id="team-chat-messages" class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF8F5]/50">
                <!-- Preenchido dinamicamente por renderTeamChat() -->
              </div>

              <!-- Barra de Envio de Mensagens -->
              <div class="p-3 sm:p-3.5 bg-white border-t border-[#E4DDD3]">
                <div id="chat-input-container" class="flex items-center gap-2">
                  <input type="text" id="team-chat-input"
                    placeholder="Escreve uma mensagem... (Enter para enviar)"
                    onkeydown="handleChatInputKeyDown(event)"
                    class="crm-input py-2.5 px-3.5 text-xs flex-1 bg-white border-[#E4DDD3] focus:border-[#6C1C37] rounded-xl shadow-2xs">
                  <button type="button" onclick="sendChatMessage()" id="btn-send-chat"
                    class="btn-primary py-2.5 px-4 text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer rounded-xl">
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

# Complete WhatsApp JS Module
$whatsappJsModule = @'

    // ========================================================
    // MÓDULO DE COMUNICAÇÃO: ANÚNCIOS & CHAT ESTILO WHATSAPP
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

    const INITIAL_CHAT_CONVERSATIONS = [
      {
        id: 'channel-geral',
        type: 'group',
        name: 'Canal Geral (Equipa MODO)',
        role: 'Toda a Agência · 5 membros',
        avatar: 'GE',
        avatarBg: 'bg-[#6C1C37]',
        online: true,
        lastMessage: 'Perfeito. Se precisares de validação das declarações do porta-voz, estou disponível no gabinete.',
        lastTime: '11:05',
        unread: 0
      },
      {
        id: 'dm-tiago',
        type: 'direct',
        email: 'tiagoperesmendes@gmail.com',
        name: 'Tiago Mendes',
        role: 'Diretor Geral',
        avatar: 'TM',
        avatarBg: 'bg-[#6C1C37]',
        online: true,
        lastMessage: 'Aprovação da nota de imprensa Q4 confirmada.',
        lastTime: '11:20',
        unread: 1
      },
      {
        id: 'dm-leonor',
        type: 'direct',
        email: 'leonor.rp.faculdade@gmail.com',
        name: 'Leonor Rodrigues',
        role: 'Técnica de Comunicação',
        avatar: 'LR',
        avatarBg: 'bg-[#3F5A2E]',
        online: true,
        lastMessage: 'Já enviei o follow-up para o Nuno Abreu no ECO.',
        lastTime: '10:45',
        unread: 0
      },
      {
        id: 'dm-helena',
        type: 'direct',
        email: 'helena.ramos@modo.pt',
        name: 'Helena Ramos',
        role: 'Consultora de Relações Públicas',
        avatar: 'HR',
        avatarBg: 'bg-[#5A4378]',
        online: true,
        lastMessage: 'O clipping do Expresso já está carregado na pasta do projeto.',
        lastTime: 'Ontem',
        unread: 0
      },
      {
        id: 'dm-carlos',
        type: 'direct',
        email: 'carlos.silva@modo.pt',
        name: 'Carlos Silva',
        role: 'Gestor de Contas',
        avatar: 'CS',
        avatarBg: 'bg-[#8A3E22]',
        online: false,
        lastMessage: 'Confirmo a presença na conferência de imprensa de amanhã.',
        lastTime: '22 Nov',
        unread: 0
      }
    ];

    const INITIAL_CHAT_MESSAGES_MAP = {
      'channel-geral': [
        {
          id: 'm-g-1',
          senderEmail: 'leonor.rp.faculdade@gmail.com',
          senderName: 'Leonor Rodrigues',
          senderRole: 'Técnica de Comunicação',
          time: '10:15',
          date: 'Hoje',
          text: 'Bom dia equipa! Já enviei a nota de imprensa revista sobre o Lançamento do Fundo Ibérico para os editores da Lusa e do ECO.'
        },
        {
          id: 'm-g-2',
          senderEmail: 'tiagoperesmendes@gmail.com',
          senderName: 'Tiago Mendes',
          senderRole: 'Diretor Geral',
          time: '10:22',
          date: 'Hoje',
          text: 'Excelente trabalho, Leonor. Por favor acompanha a confirmação de receção com o Nuno Abreu no ECO antes das 15h.'
        },
        {
          id: 'm-g-3',
          senderEmail: 'leonor.rp.faculdade@gmail.com',
          senderName: 'Leonor Rodrigues',
          senderRole: 'Técnica de Comunicação',
          time: '10:25',
          date: 'Hoje',
          text: 'Combinado, já tenho a tarefa de contacto agendada no diário de tarefas para o início da tarde.'
        },
        {
          id: 'm-g-4',
          senderEmail: 'tiagoperesmendes@gmail.com',
          senderName: 'Tiago Mendes',
          senderRole: 'Diretor Geral',
          time: '11:05',
          date: 'Hoje',
          text: 'Perfeito. Se precisares de validação das declarações do porta-voz, estou disponível no gabinete.'
        }
      ],
      'dm-tiago': [
        {
          id: 'm-t-1',
          senderEmail: 'leonor.rp.faculdade@gmail.com',
          senderName: 'Leonor Rodrigues',
          senderRole: 'Técnica de Comunicação',
          time: '11:15',
          date: 'Hoje',
          text: 'Olá Tiago, tens 5 minutos para rever a minuta da nota de lançamento?'
        },
        {
          id: 'm-t-2',
          senderEmail: 'tiagoperesmendes@gmail.com',
          senderName: 'Tiago Mendes',
          senderRole: 'Diretor Geral',
          time: '11:20',
          date: 'Hoje',
          text: 'Sim, acabei de rever e está aprovada. Podes avançar com o envio para os contactos prioritários.'
        }
      ],
      'dm-leonor': [
        {
          id: 'm-l-1',
          senderEmail: 'tiagoperesmendes@gmail.com',
          senderName: 'Tiago Mendes',
          senderRole: 'Diretor Geral',
          time: '10:30',
          date: 'Hoje',
          text: 'Leonor, como correu o contacto telefónico com a redação da SIC Notícias?'
        },
        {
          id: 'm-l-2',
          senderEmail: 'leonor.rp.faculdade@gmail.com',
          senderName: 'Leonor Rodrigues',
          senderRole: 'Técnica de Comunicação',
          time: '10:45',
          date: 'Hoje',
          text: 'Já enviei o follow-up para o Nuno Abreu no ECO e confirmei que a Sofia Martins na SIC está a acompanhar a pauta.'
        }
      ],
      'dm-helena': [
        {
          id: 'm-h-1',
          senderEmail: 'helena.ramos@modo.pt',
          senderName: 'Helena Ramos',
          senderRole: 'Consultora de Relações Públicas',
          time: '16:40',
          date: 'Ontem',
          text: 'O clipping do Expresso já está carregado na pasta do projeto e registado no sistema.'
        }
      ],
      'dm-carlos': [
        {
          id: 'm-c-1',
          senderEmail: 'carlos.silva@modo.pt',
          senderName: 'Carlos Silva',
          senderRole: 'Gestor de Contas',
          time: '14:10',
          date: '22 Nov',
          text: 'Confirmo a presença na conferência de imprensa de amanhã com o cliente.'
        }
      ]
    };

    let localAnnouncements = [];
    let localChatConversations = [];
    let localChatMessagesMap = {};
    let activeChatId = 'channel-geral';
    let currentCommTab = 'announcements';

    function initCommunicationData() {
      const savedAnn = localStorage.getItem('rep_announcements');
      if (savedAnn) {
        try { localAnnouncements = JSON.parse(savedAnn); } catch(e) { localAnnouncements = [...INITIAL_ANNOUNCEMENTS]; }
      } else {
        localAnnouncements = [...INITIAL_ANNOUNCEMENTS];
      }

      const savedConvs = localStorage.getItem('rep_chat_conversations');
      if (savedConvs) {
        try { localChatConversations = JSON.parse(savedConvs); } catch(e) { localChatConversations = [...INITIAL_CHAT_CONVERSATIONS]; }
      } else {
        localChatConversations = [...INITIAL_CHAT_CONVERSATIONS];
      }

      const savedMsgs = localStorage.getItem('rep_chat_messages_map');
      if (savedMsgs) {
        try { localChatMessagesMap = JSON.parse(savedMsgs); } catch(e) { localChatMessagesMap = { ...INITIAL_CHAT_MESSAGES_MAP }; }
      } else {
        localChatMessagesMap = { ...INITIAL_CHAT_MESSAGES_MAP };
      }
    }

    function syncCommunicationStorage() {
      localStorage.setItem('rep_announcements', JSON.stringify(localAnnouncements));
      localStorage.setItem('rep_chat_conversations', JSON.stringify(localChatConversations));
      localStorage.setItem('rep_chat_messages_map', JSON.stringify(localChatMessagesMap));
      updateCommunicationCounts();
    }

    function updateCommunicationCounts() {
      const countEl = document.getElementById('comm-count-announcements');
      if (countEl) countEl.innerText = localAnnouncements.length;
      
      let totalMsgs = 0;
      Object.values(localChatMessagesMap).forEach(arr => { totalMsgs += (arr || []).length; });
      const countChatEl = document.getElementById('comm-count-chat');
      if (countChatEl) countChatEl.innerText = totalMsgs;

      const sideCommEl = document.getElementById('sidebar-comm-count');
      if (sideCommEl) sideCommEl.innerText = localAnnouncements.length;

      const sumEl = document.getElementById('comm-summary-text');
      if (sumEl) {
        sumEl.innerText = `${localAnnouncements.length} anúncios da direção · ${localChatConversations.length} conversas disponíveis`;
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
        renderChatContactsList();
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
          chatInput.placeholder = "Escreve uma mensagem... (Enter para enviar)";
        }
        if (btnSend) btnSend.disabled = false;
        if (viewerNotice) viewerNotice.classList.add('hidden');
      }

      if (currentCommTab === 'chat') {
        renderChatContactsList();
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

            <h2 class="text-base sm:text-lg font-bold font-title text-[#1A1A1A] tracking-tight">
              ${escapeHtml(ann.title)}
            </h2>

            <div class="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8]">
              ${escapeHtml(ann.content)}
            </div>

            <div class="pt-2 flex items-center justify-between text-[11px] text-[#8A8A8A] border-t border-[#E4DDD3]/60">
              <span>Destinatários: <strong>${ann.target === 'tech' ? 'Técnicos de Comunicação' : (ann.target === 'press' ? 'Assessores de Imprensa' : 'Toda a Agência MODO')}</strong></span>
              <span class="text-[10px] uppercase font-semibold tracking-wider text-[#6C1C37]">Diretiva Oficial MODO</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // ==========================================
    // LÓGICA DO CHAT ESTILO WHATSAPP
    // ==========================================
    function renderChatContactsList() {
      const listEl = document.getElementById('chat-contacts-list');
      if (!listEl) return;

      const userEmail = (currentUser?.email || '').toLowerCase();
      const q = (document.getElementById('chat-search-contacts')?.value || '').toLowerCase().trim();

      // Filtrar conversas: esconder o próprio utilizador nas conversas diretas
      let convs = localChatConversations.filter(c => {
        if (c.type === 'direct' && c.email && c.email.toLowerCase() === userEmail) {
          return false;
        }
        return true;
      });

      if (q) {
        convs = convs.filter(c =>
          (c.name || '').toLowerCase().includes(q) ||
          (c.role || '').toLowerCase().includes(q) ||
          (c.lastMessage || '').toLowerCase().includes(q)
        );
      }

      listEl.innerHTML = convs.map(c => {
        const isActive = c.id === activeChatId;
        return `
          <div onclick="selectChatConversation('${c.id}')"
            class="p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer transition-all ${isActive ? 'bg-[#F2ECE4] border-l-4 border-[#6C1C37]' : 'hover:bg-white'}">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-full ${c.avatarBg || 'bg-[#6C1C37]'} text-white flex items-center justify-center font-bold text-xs font-title shadow-2xs">
                ${c.avatar || 'CO'}
              </div>
              ${c.online ? `<span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2F6B3A] border-2 border-white rounded-full"></span>` : ''}
            </div>

            <!-- Dados do Contacto -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="text-xs font-semibold text-[#1A1A1A] truncate">${c.name}</span>
                <span class="text-[10px] text-[#8A8A8A] shrink-0">${c.lastTime || ''}</span>
              </div>
              <p class="text-[11px] text-[#6B6B6B] truncate">${c.lastMessage || 'Clica para iniciar conversa'}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    function selectChatConversation(chatId) {
      activeChatId = chatId;
      const conv = localChatConversations.find(c => c.id === chatId);
      if (conv) {
        conv.unread = 0;
        const nameEl = document.getElementById('active-chat-name');
        if (nameEl) nameEl.innerText = conv.name;
        const roleEl = document.getElementById('active-chat-role');
        if (roleEl) roleEl.innerText = conv.role;
        const avatarEl = document.getElementById('active-chat-avatar');
        if (avatarEl) {
          avatarEl.innerText = conv.avatar || 'CO';
          avatarEl.className = `w-9 h-9 rounded-full ${conv.avatarBg || 'bg-[#6C1C37]'} text-white flex items-center justify-center font-bold text-xs font-title shadow-2xs`;
        }
        const onlineDot = document.getElementById('active-chat-online-dot');
        if (onlineDot) onlineDot.style.display = conv.online ? '' : 'none';
        const statusBadge = document.getElementById('active-chat-status-badge');
        if (statusBadge) statusBadge.style.display = conv.online ? '' : 'none';

        const input = document.getElementById('team-chat-input');
        if (input && !input.disabled) {
          input.placeholder = `Escreve uma mensagem para ${conv.name}... (Enter para enviar)`;
        }
      }

      renderChatContactsList();
      renderTeamChat();

      // Mobile: mostrar painel da conversa
      const sidebarPanel = document.getElementById('chat-sidebar-panel');
      const convPanel = document.getElementById('chat-conversation-panel');
      if (window.innerWidth < 768) {
        if (sidebarPanel) sidebarPanel.classList.add('hidden');
        if (convPanel) convPanel.classList.remove('hidden');
      }
    }

    function showChatSidebarMobile() {
      const sidebarPanel = document.getElementById('chat-sidebar-panel');
      const convPanel = document.getElementById('chat-conversation-panel');
      if (sidebarPanel) sidebarPanel.classList.remove('hidden');
      if (convPanel) convPanel.classList.add('hidden');
    }

    function filterChatContacts(query) {
      renderChatContactsList();
    }

    function renderTeamChat() {
      const box = document.getElementById('team-chat-messages');
      if (!box) return;

      const msgs = localChatMessagesMap[activeChatId] || [];
      const currentEmail = (currentUser?.email || '').toLowerCase();
      const currentName = currentUser?.name || currentUser?.user_metadata?.full_name || 'Tiago Mendes';
      const myInitials = currentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TM';

      const activeConv = localChatConversations.find(c => c.id === activeChatId);
      const isGroup = activeConv && activeConv.type === 'group';

      if (msgs.length === 0) {
        box.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center text-xs text-[#6B6B6B] space-y-1 p-6 text-center">
            <div class="w-12 h-12 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#6C1C37] mb-2 shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <p class="font-semibold text-[#1A1A1A]">Início da conversa com ${activeConv ? activeConv.name : 'este contacto'}</p>
            <p class="text-[11px] text-[#8A8A8A]">As mensagens enviadas ficam registadas no sistema MODO.</p>
          </div>
        `;
        return;
      }

      box.innerHTML = `
        <div class="flex justify-center my-2">
          <span class="px-3 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E] shadow-2xs">Hoje</span>
        </div>
        ${msgs.map(msg => {
          const senderEmail = (msg.senderEmail || '').toLowerCase();
          const isMine = currentEmail && (senderEmail === currentEmail);

          let initials = 'CO';
          let avatarBg = 'bg-[#6C1C37]';
          if (senderEmail.includes('tiago')) {
            initials = 'TM';
            avatarBg = 'bg-[#6C1C37]';
          } else if (senderEmail.includes('leonor')) {
            initials = 'LR';
            avatarBg = 'bg-[#3F5A2E]';
          } else if (senderEmail.includes('helena')) {
            initials = 'HR';
            avatarBg = 'bg-[#5A4378]';
          } else if (senderEmail.includes('carlos')) {
            initials = 'CS';
            avatarBg = 'bg-[#8A3E22]';
          }

          if (isMine) {
            return `
              <div class="flex items-end gap-2 max-w-[85%] sm:max-w-md ml-auto flex-row-reverse group">
                <div class="w-7 h-7 rounded-full bg-[#6C1C37] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-1 font-title shadow-2xs">
                  ${myInitials}
                </div>
                <div class="bg-[#F8EFEA] border border-[#E6C5CA]/80 rounded-2xl rounded-br-xs p-3 shadow-2xs space-y-1 text-right">
                  <div class="text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap text-left">${escapeHtml(msg.text)}</div>
                  <div class="flex items-center justify-end gap-1 text-[10px] text-[#8A8A8A] mt-0.5">
                    <span>${msg.time || 'Agora'}</span>
                    <svg class="w-3.5 h-3.5 text-[#6C1C37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7m-14 4l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="flex items-end gap-2 max-w-[85%] sm:max-w-md group">
                <div class="w-7 h-7 rounded-full ${avatarBg} text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-1 font-title shadow-2xs">
                  ${initials}
                </div>
                <div class="bg-white border border-[#E4DDD3] rounded-2xl rounded-bl-xs p-3 shadow-2xs space-y-1">
                  ${isGroup ? `<div class="text-[10px] font-semibold text-[#6C1C37]">${msg.senderName} <span class="text-[#8A8A8A] font-normal">(${msg.senderRole || 'Consultor'})</span></div>` : ''}
                  <div class="text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">${escapeHtml(msg.text)}</div>
                  <div class="text-[10px] text-[#8A8A8A] text-right mt-0.5">${msg.time || 'Agora'}</div>
                </div>
              </div>
            `;
          }
        }).join('')}
      `;

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

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newMsg = {
        id: 'msg-' + Date.now(),
        senderEmail: userEmail,
        senderName: authorName,
        senderRole: roleTitle,
        time: timeStr,
        date: 'Hoje',
        text: text
      };

      if (!localChatMessagesMap[activeChatId]) {
        localChatMessagesMap[activeChatId] = [];
      }
      localChatMessagesMap[activeChatId].push(newMsg);

      // Atualizar última mensagem na lista de conversas
      const conv = localChatConversations.find(c => c.id === activeChatId);
      if (conv) {
        conv.lastMessage = text;
        conv.lastTime = timeStr;
      }

      syncCommunicationStorage();
      input.value = '';
      renderChatContactsList();
      renderTeamChat();
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
      showToast('Anúncio publicado com sucesso.');
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
'@

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Replace the entire #comm-content-chat block
    $chatOldPattern = '<!-- SECÇÃO 2: CHAT -->\s*<div id="comm-content-chat"[\s\S]*?</div>\s*</div>\s*</div>\s*</div>'
    if ($content -match $chatOldPattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $chatOldPattern, $whatsappChatHtml.Trim())
        Write-Output "Replaced comm-content-chat with WhatsApp layout in $file"
    } else {
        Write-Output "Chat pattern not matched directly in $file"
    }

    # 2. Replace the entire communication JS module
    $jsOldPattern = '// MÓDULO DE COMUNICAÇÃO[\s\S]*?function deleteChatMessage\(msgId\) \{[\s\S]*?\}'
    if ($content -match $jsOldPattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $jsOldPattern, $whatsappJsModule.Trim())
        Write-Output "Replaced communication JS module in $file"
    } else {
        Write-Output "JS pattern not matched directly in $file"
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
