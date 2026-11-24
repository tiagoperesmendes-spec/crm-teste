$files = @("dashboard.html", "index.html")

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

foreach ($file in $files) {
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Insert view-communication right before VISTA 5: DETALHE DO PROJETO
    $targetViewMarker = '<!-- VISTA 5: DETALHE DO PROJETO (view-project-detail)'
    if ($content.Contains($targetViewMarker) -and -not $content.Contains('id="view-communication"')) {
        $content = $content.Replace($targetViewMarker, $commViewMarkup + "`n`n      <!-- ======================================================== -->`n      " + $targetViewMarker)
        Write-Output "Inserted view-communication into $file"
    }

    # 2. Insert modal-announcement right before <div id="modal-new-task"
    $targetModalMarker = '<div id="modal-new-task"'
    if ($content.Contains($targetModalMarker) -and -not $content.Contains('id="modal-announcement"')) {
        $content = $content.Replace($targetModalMarker, $annModalMarkup + "`n`n  " + $targetModalMarker)
        Write-Output "Inserted modal-announcement into $file"
    }

    # 3. Fix switchView outlets line and add communication
    $badSwitchLine = "document.getElementById('view-outlets', 'view-communication').classList.remove('hidden');"
    $goodSwitchBlock = @'
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

    if ($content.Contains($badSwitchLine)) {
        $targetToReplace = "document.getElementById('view-outlets', 'view-communication').classList.remove('hidden');`r`n        document.getElementById('page-title').innerText = `"Meios`";`r`n        document.getElementById('page-subtitle').innerText = `"Registo de redações, moradas, grupos de media, registo ERC e formatos.`";`r`n        renderOutletsTable();"
        if (-not $content.Contains($targetToReplace)) {
            $targetToReplace = "document.getElementById('view-outlets', 'view-communication').classList.remove('hidden');`n        document.getElementById('page-title').innerText = `"Meios`";`n        document.getElementById('page-subtitle').innerText = `"Registo de redações, moradas, grupos de media, registo ERC e formatos.`";`n        renderOutletsTable();"
        }
        $content = $content.Replace($targetToReplace, $goodSwitchBlock)
        Write-Output "Fixed switchView and added communication branch in $file"
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
