$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

# 1. Sidebar Button for Anúncios right below Comunicação
$sidebarAnnouncementsButton = @'
          <!-- 5. Anúncios da Direção -->
          <button onclick="switchView('announcements')" id="nav-announcements"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
              <span>Anúncios</span>
            </div>
            <span id="sidebar-announcements-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full">3</span>
          </button>
'@

# 2. Separated View Markup: view-communication (Chat puro) + view-announcements (Anúncios puro)
$separatedViewsMarkup = @'
      <!-- ======================================================== -->
      <!-- VISTA 6: COMUNICAÇÃO (CHAT DA EQUIPA ESTILO WHATSAPP)    -->
      <!-- ======================================================== -->
      <div id="view-communication"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-5 w-full max-w-none transition-all duration-300">

        <!-- Topo da página -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-baseline gap-3 flex-wrap">
            <h1 class="text-2xl font-bold font-title text-[#1A1A1A] tracking-tight">Comunicação</h1>
            <span id="comm-summary-text" class="text-xs text-[#6B6B6B] font-normal">Chat em direto entre colaboradores com canais e mensagens diretas</span>
          </div>
        </div>

        <!-- Ecrã WhatsApp de 2 Colunas -->
        <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-card overflow-hidden flex flex-col md:flex-row h-[640px]">
          
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

      <!-- ======================================================== -->
      <!-- VISTA 7: ANÚNCIOS DA DIREÇÃO (MURAL OFICIAL MODO)         -->
      <!-- ======================================================== -->
      <div id="view-announcements"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-5 w-full max-w-none transition-all duration-300">

        <!-- Topo da página: Título + Resumo calculado + Botão Novo Anúncio (Diretor) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-baseline gap-3 flex-wrap">
            <h1 class="text-2xl font-bold font-title text-[#1A1A1A] tracking-tight">Anúncios</h1>
            <span id="announcements-summary-header" class="text-xs text-[#6B6B6B] font-normal">3 anúncios ativos da direção</span>
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

        <!-- Barra de Pesquisa de Anúncios -->
        <div class="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E4DDD3] shadow-xs flex items-center">
          <div class="relative flex-1">
            <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="search-announcements" oninput="renderAnnouncementsList()"
              placeholder="Pesquisar anúncios e diretivas da direção..."
              class="crm-input pl-9 pr-3 py-1.5 text-xs w-full bg-[#FAF8F5] border-[#E8E2D8] focus:bg-white">
          </div>
        </div>

        <!-- Feed de Anúncios -->
        <div id="announcements-feed-container" class="space-y-4">
          <!-- Preenchido dinamicamente por renderAnnouncementsList() -->
        </div>

      </div>
'@

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Add nav-announcements right below nav-communication in sidebar
    $navCommPattern = '(<button onclick="switchView\(''communication''\)" id="nav-communication"[\s\S]*?</button>)'
    if ($content -match $navCommPattern -and -not $content.Contains('id="nav-announcements"')) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $navCommPattern, "`$1`n" + $sidebarAnnouncementsButton)
        Write-Output "Added nav-announcements button to sidebar in $file"
    }

    # 2. Replace view-communication markup with the separated views
    $oldViewPattern = '<!-- ======================================================== -->\s*<!-- VISTA 6: COMUNICAÇÃO[\s\S]*?</div>\s*</div>\s*</div>\s*</div>\s*</div>'
    if ($content -match $oldViewPattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldViewPattern, $separatedViewsMarkup.Trim())
        Write-Output "Replaced view-communication with separated views in $file"
    }

    # 3. Update validViews, allViewIds, navIds to include 'announcements'
    if ($content.Contains("'communication']") -and -not $content.Contains("'announcements']")) {
        $content = $content.Replace("'communication']", "'communication', 'announcements']")
        Write-Output "Updated validViews to include announcements in $file"
    }
    if ($content.Contains("'view-communication'") -and -not $content.Contains("'view-announcements'")) {
        $content = $content.Replace("'view-communication'", "'view-communication', 'view-announcements'")
        Write-Output "Updated allViewIds to include view-announcements in $file"
    }
    if ($content.Contains("'nav-communication']") -and -not $content.Contains("'nav-announcements']")) {
        $content = $content.Replace("'nav-communication']", "'nav-communication', 'nav-announcements']")
        Write-Output "Updated navIds to include nav-announcements in $file"
    }

    # 4. Update switchView logic
    $oldSwitchBranch = @'
      } else if (viewName === 'communication') {
        document.getElementById('view-communication').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Comunicação";
        document.getElementById('page-subtitle').innerText = "Mural de avisos da direção e mensagens entre a equipa.";
        renderCommunicationView();
'@

    $newSwitchBranch = @'
      } else if (viewName === 'communication') {
        document.getElementById('view-communication').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Comunicação";
        document.getElementById('page-subtitle').innerText = "Chat da equipa em direto com canais e conversas diretas.";
        renderCommunicationView();
      } else if (viewName === 'announcements') {
        document.getElementById('view-announcements').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Anúncios";
        document.getElementById('page-subtitle').innerText = "Diretivas e comunicados oficiais da direção geral.";
        renderAnnouncementsView();
'@

    if ($content.Contains($oldSwitchBranch)) {
        $content = $content.Replace($oldSwitchBranch, $newSwitchBranch)
        Write-Output "Updated switchView for separated communication and announcements in $file"
    }

    # 5. Add renderAnnouncementsView() in JS
    $annViewJs = @'
    function renderAnnouncementsView() {
      initCommunicationData();
      updateCommunicationCounts();

      const isDirector = (currentUser?.user_metadata?.role === 'director') || ((currentUser?.email || '').toLowerCase().includes('tiagoperesmendes@gmail.com'));
      const btnNewAnn = document.getElementById('btn-open-announcement-modal');
      if (btnNewAnn) {
        btnNewAnn.style.display = isDirector ? 'flex' : 'none';
      }

      renderAnnouncementsList();
    }
'@

    if (-not $content.Contains('function renderAnnouncementsView()')) {
        $content = $content.Replace('function renderCommunicationView() {', $annViewJs + "`n`n    function renderCommunicationView() {")
        Write-Output "Added renderAnnouncementsView() function in $file"
    }

    # 6. Update updateCommunicationCounts to update announcements-summary-header and sidebar badges
    $updateCountsOld = @'
      const sideCommEl = document.getElementById('sidebar-comm-count');
      if (sideCommEl) sideCommEl.innerText = localAnnouncements.length;

      const sumEl = document.getElementById('comm-summary-text');
      if (sumEl) {
        sumEl.innerText = `${localAnnouncements.length} anúncios da direção · ${localChatConversations.length} conversas disponíveis`;
      }
'@

    $updateCountsNew = @'
      const sideCommEl = document.getElementById('sidebar-comm-count');
      if (sideCommEl) sideCommEl.innerText = localChatConversations.length;

      const sideAnnEl = document.getElementById('sidebar-announcements-count');
      if (sideAnnEl) sideAnnEl.innerText = localAnnouncements.length;

      const sumEl = document.getElementById('comm-summary-text');
      if (sumEl) {
        sumEl.innerText = `Chat em direto entre colaboradores · ${localChatConversations.length} contactos disponíveis`;
      }

      const annSumEl = document.getElementById('announcements-summary-header');
      if (annSumEl) {
        annSumEl.innerText = `${localAnnouncements.length} anúncios ativos da direção geral`;
      }
'@

    if ($content.Contains($updateCountsOld)) {
        $content = $content.Replace($updateCountsOld, $updateCountsNew)
        Write-Output "Updated updateCommunicationCounts in $file"
    }

    # 7. Update handleCreateAnnouncement to navigate to announcements view
    $content = $content.Replace("setCommTab('announcements');", "switchView('announcements');")

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
