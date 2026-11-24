# Script to update dashboard.html and index.html

$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Replace #view-projects
$startMarker = '<!-- VISTA 3: PROJETOS DE COMUNICAÇÃO (view-projects)         -->'
$endMarker = '<!-- Vista Quadro (Kanban por Estado) -->
        <div id="projects-kanban-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- 5 Colunas geradas dinamicamente -->
        </div>
      </div>'

$startPos = $html.IndexOf($startMarker)
$endPos = $html.IndexOf($endMarker)
if ($startPos -lt 0 -or $endPos -lt 0) {
    throw "view-projects markers not found: startPos=$startPos, endPos=$endPos"
}
$endPos = $endPos + $endMarker.Length

$newViewProjects = @'
<!-- VISTA 3: PROJETOS DE COMUNICAÇÃO (view-projects)         -->
      <!-- ======================================================== -->
      <div id="view-projects"
        class="hidden p-4 sm:p-6 lg:p-8 space-y-5 w-full max-w-none transition-all duration-300">

        <!-- Topo da página: Título + Resumo calculado + Botão Novo projeto -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-baseline gap-3 flex-wrap">
            <h1 class="text-2xl font-bold text-[#1A1A1A] font-title tracking-tight">Projetos</h1>
            <span id="projects-summary-text" class="text-xs text-[#7A7A7A] font-normal">3 com entrega esta semana · 1 em atraso</span>
          </div>
          <button onclick="openProjectModal()" id="view-projects-add-btn"
            class="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-semibold bg-[#6C1C37] text-white hover:bg-[#56162C] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>+ Novo projeto</span>
          </button>
        </div>

        <!-- Separadores por estado com contagens -->
        <div class="border-b border-[#E4DDD3]/70 pt-1">
          <div class="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs">
            <button type="button" onclick="setProjectsStatusTab('all')" id="proj-tab-all"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0">
              <span>Todos</span>
              <span id="proj-tab-count-all" class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white">8</span>
            </button>
            <button type="button" onclick="setProjectsStatusTab('em_preparacao')" id="proj-tab-em_preparacao"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>Em preparação</span>
              <span id="proj-tab-count-em_preparacao" class="text-[11px] font-normal text-[#8A8A8A]">2</span>
            </button>
            <button type="button" onclick="setProjectsStatusTab('em_curso')" id="proj-tab-em_curso"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>Em curso</span>
              <span id="proj-tab-count-em_curso" class="text-[11px] font-normal text-[#8A8A8A]">3</span>
            </button>
            <button type="button" onclick="setProjectsStatusTab('aguarda_aprovacao')" id="proj-tab-aguarda_aprovacao"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>A aguardar aprovação</span>
              <span id="proj-tab-count-aguarda_aprovacao" class="text-[11px] font-normal text-[#8A8A8A]">1</span>
            </button>
            <button type="button" onclick="setProjectsStatusTab('em_pausa')" id="proj-tab-em_pausa"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>Em pausa</span>
              <span id="proj-tab-count-em_pausa" class="text-[11px] font-normal text-[#8A8A8A]">1</span>
            </button>
            <button type="button" onclick="setProjectsStatusTab('concluido')" id="proj-tab-concluido"
              class="proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0">
              <span>Concluídos</span>
              <span id="proj-tab-count-concluido" class="text-[11px] font-normal text-[#8A8A8A]">1</span>
            </button>
          </div>
        </div>

        <!-- Barra de filtros numa só linha -->
        <div class="flex flex-wrap lg:flex-nowrap items-center gap-3 pt-1">
          <!-- Pesquisa de projeto ou cliente -->
          <div class="relative flex-1 min-w-[220px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="filter-proj-search" oninput="filterProjectsBySearch(this.value)"
              placeholder="Pesquisar projeto ou cliente"
              class="w-full bg-white border border-[#E4DDD3] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-xs">
          </div>

          <!-- Cliente -->
          <select id="filter-proj-client" onchange="filterProjectsByClient(this.value)"
            class="bg-white border border-[#E4DDD3] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-pointer focus:outline-none focus:border-[#6C1C37] shadow-xs">
            <option value="all">Todos os clientes</option>
          </select>

          <!-- Responsável -->
          <select id="filter-proj-responsible" onchange="filterProjectsByResponsible(this.value)"
            class="bg-white border border-[#E4DDD3] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-pointer focus:outline-none focus:border-[#6C1C37] shadow-xs">
            <option value="all">Todos os responsáveis</option>
            <option value="Tiago Mendes">Tiago Mendes</option>
            <option value="Leonor Rodrigues">Leonor Rodrigues</option>
            <option value="Helena Ramos">Helena Ramos</option>
            <option value="Carlos Silva">Carlos Silva</option>
          </select>

          <!-- Prioridade -->
          <select id="filter-proj-priority" onchange="filterProjectsByPriority(this.value)"
            class="bg-white border border-[#E4DDD3] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-pointer focus:outline-none focus:border-[#6C1C37] shadow-xs">
            <option value="all">Todas as prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <!-- Alternador Lista / Quadro -->
          <div class="flex items-center bg-white border border-[#E4DDD3] rounded-xl p-1 shadow-xs shrink-0">
            <button id="btn-proj-view-list" onclick="setProjectsViewMode('list')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <span>Lista</span>
            </button>
            <button id="btn-proj-view-kanban" onclick="setProjectsViewMode('kanban')"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
              </svg>
              <span>Quadro</span>
            </button>
          </div>
        </div>

        <!-- Vista Lista: Tabela com 6 colunas + menu 3 pontos -->
        <div id="projects-list-container" class="bg-white rounded-2xl border border-[#E4DDD3] overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs" id="projects-table">
              <thead class="bg-[#FAF8F5] border-b border-[#E4DDD3]/80">
                <tr>
                  <th class="py-3.5 px-5 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Projeto</th>
                  <th class="py-3.5 px-4 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Estado</th>
                  <th class="py-3.5 px-4 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Prioridade</th>
                  <th class="py-3.5 px-4 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Entrega</th>
                  <th class="py-3.5 px-4 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Responsável</th>
                  <th class="py-3.5 px-4 text-left text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">Progresso</th>
                  <th class="py-3.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody id="projects-table-body" class="divide-y divide-[#E4DDD3]/60">
                <!-- Preenchido dinamicamente -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vista Quadro (Kanban por Estado) -->
        <div id="projects-kanban-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- 5 Colunas geradas dinamicamente -->
        </div>
      </div>
'@

$html = $html.Substring(0, $startPos) + $newViewProjects + $html.Substring($endPos)
Write-Host "Replaced view-projects markup successfully."

# 2. Replace #modal-new-project markup
$modalStartMarker = '<div id="modal-new-project"'
$modalFollowMarker = '<div id="modal-new-contact"'

$mStartPos = $html.IndexOf($modalStartMarker)
$mFollowPos = $html.IndexOf($modalFollowMarker)
if ($mStartPos -lt 0 -or $mFollowPos -lt 0) {
    throw "modal markers not found: mStartPos=$mStartPos, mFollowPos=$mFollowPos"
}

# The modal end position is right before '<div id="modal-new-contact"' minus any comment separator
$modalBlockBeforeContact = $html.Substring(0, $mFollowPos)
$mEndPos = $modalBlockBeforeContact.LastIndexOf('<!-- ======================================================== -->')
if ($mEndPos -lt $mStartPos) {
    $mEndPos = $mFollowPos
}

$newModalHtml = @'
<div id="modal-new-project"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
    <div
      class="bg-white w-full max-w-xl rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
      
      <!-- Topo / Cabeçalho -->
      <div class="p-5 sm:p-6 pb-4 flex items-start justify-between bg-white shrink-0">
        <div class="space-y-0.5">
          <h2 class="text-base font-bold text-[#1A1A1A] font-title">Novo projeto</h2>
          <p class="text-xs text-[#8A8A8A]">Só precisas de 5 campos para começar. O resto podes preencher depois.</p>
        </div>
        <button type="button" onclick="closeProjectModal()" class="text-[#8A8A8A] hover:text-[#1A1A1A] p-1.5 rounded-full hover:bg-[#F0ECE7] transition-colors cursor-pointer" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Formulário com 5 obrigatórios (*) + opcionais -->
      <form id="form-new-project" onsubmit="handleNewProjectSubmit(event)" class="overflow-y-auto flex-1 px-5 sm:px-6 py-2 space-y-4 text-xs">
        
        <!-- 1. Nome do projeto * -->
        <div>
          <label class="block font-semibold text-[#1A1A1A] mb-1.5">Nome do projeto *</label>
          <input type="text" id="project-name" required oninput="checkNewProjectFormValidity()"
            placeholder="Expansão Ibérica 2026"
            class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors">
        </div>

        <!-- 2. Cliente * e Tipo * (2 colunas) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Cliente *</label>
            <div class="relative">
              <input type="text" id="project-client" required oninput="onProjectClientInput(this.value); checkNewProjectFormValidity()"
                onfocus="onProjectClientInput(this.value)" autocomplete="off"
                placeholder="Grupo M"
                class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors">
              <div id="project-client-suggestions"
                class="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-[#E4DDD3] rounded-xl shadow-lg hidden max-h-48 overflow-y-auto py-1">
              </div>
            </div>
            <p class="text-[11px] text-[#8A8A8A] mt-1">Escreve um nome novo para o criar.</p>
          </div>

          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Tipo *</label>
            <div class="relative">
              <select id="project-type" required onchange="checkNewProjectFormValidity()"
                class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] transition-colors cursor-pointer appearance-none pr-8">
                <option value="campanha" selected>Campanha</option>
                <option value="comunicado">Comunicado</option>
                <option value="evento">Evento</option>
                <option value="entrevista">Entrevista</option>
                <option value="lancamento">Lançamento</option>
                <option value="crise">Gestão de crise</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A8A8A]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Data de entrega * e Responsável * (2 colunas) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Data de entrega *</label>
            <input type="date" id="project-deadline" required oninput="checkNewProjectFormValidity()"
              class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] transition-colors cursor-pointer">
          </div>

          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Responsável *</label>
            <div class="relative">
              <select id="project-responsible" required onchange="onProjectResponsibleChange(this.value); checkNewProjectFormValidity()"
                class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] transition-colors cursor-pointer appearance-none pr-8">
                <option value="Tiago Mendes" selected>Tiago Mendes</option>
                <option value="Leonor Rodrigues">Leonor Rodrigues</option>
                <option value="Helena Ramos">Helena Ramos</option>
                <option value="Carlos Silva">Carlos Silva</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A8A8A]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Prioridade e Data de início (2 colunas) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Prioridade</label>
            <div class="flex bg-[#F0ECE7] p-1 rounded-xl gap-1">
              <button type="button" onclick="setNewProjectPriority('alta')" id="btn-prio-alta"
                class="flex-1 py-1.5 text-xs font-medium rounded-lg text-[#6B6B6B] transition-all cursor-pointer">Alta</button>
              <button type="button" onclick="setNewProjectPriority('media')" id="btn-prio-media"
                class="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all cursor-pointer">Média</button>
              <button type="button" onclick="setNewProjectPriority('baixa')" id="btn-prio-baixa"
                class="flex-1 py-1.5 text-xs font-medium rounded-lg text-[#6B6B6B] transition-all cursor-pointer">Baixa</button>
            </div>
            <input type="hidden" id="project-priority" value="media">
          </div>

          <div>
            <label class="block font-semibold text-[#1A1A1A] mb-1.5">Data de início</label>
            <input type="date" id="project-start-date"
              class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] transition-colors cursor-pointer">
          </div>
        </div>

        <!-- 5. Equipa (Chips multi-seleção com avatar) -->
        <div>
          <label class="block font-semibold text-[#1A1A1A] mb-1.5">Equipa</label>
          <div class="flex flex-wrap items-center gap-2" id="project-team-chips-container">
            <!-- Gerado dinamicamente: LE Leonor, TI Tiago, HE Helena, CA Carlos -->
          </div>
        </div>

        <!-- 6. Secção colapsável "Mais detalhes (opcional)" -->
        <div class="border-t border-[#E4DDD3]/70 pt-3">
          <button type="button" onclick="toggleNewProjectDetails()"
            class="w-full flex items-center justify-between py-1 text-xs font-semibold text-[#1A1A1A] cursor-pointer group">
            <span>Mais detalhes (opcional)</span>
            <svg id="new-project-details-chevron" class="w-4 h-4 text-[#8A8A8A] group-hover:text-[#1A1A1A] transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>

          <div id="new-project-details-content" class="space-y-3.5 pt-2">
            <!-- Objetivo -->
            <div>
              <label class="block font-semibold text-[#1A1A1A] mb-1.5">Objetivo</label>
              <textarea id="project-objective" rows="2"
                placeholder="Coordenação do anúncio ibérico e abertura de sede em Madrid com entrevistas exclusivas."
                class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors resize-none"></textarea>
            </div>

            <!-- Jornalistas-alvo -->
            <div>
              <label class="block font-semibold text-[#1A1A1A] mb-1.5">Jornalistas-alvo</label>
              <div class="border border-[#E4DDD3] rounded-xl p-2.5 bg-white space-y-2">
                <div id="project-selected-journalists-chips" class="flex flex-wrap items-center gap-1.5 empty:hidden">
                  <!-- Chips selecionadas: Marta Figueiredo · Público × -->
                </div>
                <div class="relative">
                  <input type="text" id="project-jour-search-input" oninput="onProjectJourSearchInput(this.value)"
                    autocomplete="off"
                    placeholder="Pesquisar jornalista, meio ou área..."
                    class="w-full bg-[#FAF8F5] border border-[#E4DDD3]/60 rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors">
                  <div id="project-jour-search-results"
                    class="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-[#E4DDD3] rounded-xl shadow-lg hidden max-h-44 overflow-y-auto py-1">
                  </div>
                </div>
              </div>
              <p class="text-[11px] text-[#8A8A8A] mt-1">Também podes adicionar mais tarde, na ficha do projeto.</p>
            </div>

            <!-- Links: Briefing e Pasta partilhada (2 colunas) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block font-semibold text-[#1A1A1A] mb-1.5">Link do briefing</label>
                <input type="url" id="project-link-briefing" placeholder="https://..."
                  class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors">
              </div>
              <div>
                <label class="block font-semibold text-[#1A1A1A] mb-1.5">Pasta partilhada</label>
                <input type="url" id="project-link-folder" placeholder="https://..."
                  class="w-full bg-white border border-[#E4DDD3] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors">
              </div>
            </div>
          </div>
        </div>

      </form>

      <!-- Rodapé Fixo -->
      <div class="p-4 px-6 border-t border-[#E4DDD3] flex items-center justify-between bg-white shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#8A8A8A]">Estado inicial</span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDE6DE] text-[#5C554E]">Em preparação</span>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" onclick="closeProjectModal()"
            class="px-5 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#F0ECE7] transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" form="form-new-project" id="btn-submit-new-project" disabled
            class="px-5 py-2 rounded-full text-xs font-semibold bg-[#6C1C37] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#56162C] transition-all cursor-pointer shadow-xs">Criar projeto</button>
        </div>
      </div>

    </div>
  </div>
'@

$html = $html.Substring(0, $mStartPos) + $newModalHtml + "`n`n<!-- ======================================================== -->`n  " + $html.Substring($mFollowPos)
Write-Host "Replaced modal-new-project markup successfully."

# 3. Replace DEFAULT_SAMPLE_PROJECTS
$projDataStartMarker = 'const DEFAULT_SAMPLE_PROJECTS = ['
$projDataEndMarker = '    // 12 CONTACTOS DE HOJE + 29 CONTACTOS DA SEMANA = 41 CONTACTOS NA SEMANA'

$pStartPos = $html.IndexOf($projDataStartMarker)
$pEndPos = $html.IndexOf($projDataEndMarker)
if ($pStartPos -lt 0 -or $pEndPos -lt 0) {
    throw "DEFAULT_SAMPLE_PROJECTS markers not found"
}

$newProjectsData = @'
const DEFAULT_SAMPLE_PROJECTS = [
      {
        id: 'proj-1',
        name: 'Entrevista CEO — Expresso',
        client: 'Nova Energia',
        client_or_brand: 'Nova Energia',
        type: 'entrevista',
        status: 'aguarda_aprovacao',
        priority: 'alta',
        start_date: '2026-11-01',
        deadline: '2026-11-20',
        responsible: 'Helena Ramos',
        manager_name: 'Helena Ramos',
        team: ['Helena Ramos', 'Tiago Mendes'],
        team_members: ['Helena Ramos', 'Tiago Mendes'],
        objective: 'Entrevista exclusiva do CEO ao Expresso sobre os novos investimentos em energias renováveis e transição energética.',
        description: 'Entrevista exclusiva do CEO ao Expresso sobre os novos investimentos em energias renováveis e transição energética.',
        target_journalist_ids: ['jour-2', 'jour-1'],
        target_journalists: ['Rui Almeida', 'Marta Figueiredo'],
        target_outlets: ['Expresso', 'Público'],
        links_documents: [
          { label: 'Briefing Executivo', url: 'https://docs.google.com/briefing-expresso', type: 'briefing' }
        ],
        notes: 'Aguarda aprovação final das respostas por parte da comissão executiva.',
        progress: 80,
        done_tasks: 4,
        total_tasks: 5,
        is_overdue: true,
        created_at: '2026-11-01T09:00:00Z',
        updated_at: '2026-11-21T18:00:00Z'
      },
      {
        id: 'proj-2',
        name: 'Recall de produto',
        client: 'GreenCorp',
        client_or_brand: 'GreenCorp',
        type: 'crise',
        status: 'em_curso',
        priority: 'alta',
        start_date: '2026-11-15',
        deadline: '2026-11-23',
        responsible: 'Carlos Silva',
        manager_name: 'Carlos Silva',
        team: ['Carlos Silva', 'Leonor Rodrigues'],
        team_members: ['Carlos Silva', 'Leonor Rodrigues'],
        objective: 'Gestão da crise de recall preventivo e coordenação da comunicação com jornalistas de economia e ambiente.',
        description: 'Gestão da crise de recall preventivo e coordenação da comunicação com jornalistas de economia e ambiente.',
        target_journalist_ids: ['jour-6', 'jour-9'],
        target_journalists: ['Gonçalo Neves', 'Tiago Mendes'],
        target_outlets: ['Jornal de Negócios', 'ECO Economia Online'],
        links_documents: [
          { label: 'Plano de Crise e Q&A', url: 'https://greencorp.pt/qa-crise.pdf', type: 'briefing' }
        ],
        notes: 'Comunicado enviado sob embargo. Monitorização contínua de redes e meios.',
        progress: 78,
        done_tasks: 7,
        total_tasks: 9,
        is_overdue: false,
        created_at: '2026-11-15T10:00:00Z',
        updated_at: '2026-11-21T19:00:00Z'
      },
      {
        id: 'proj-3',
        name: 'Relatório Anual de Sustentabilidade',
        client: 'EcoPower',
        client_or_brand: 'EcoPower',
        type: 'comunicado',
        status: 'em_curso',
        priority: 'alta',
        start_date: '2026-11-05',
        deadline: '2026-11-24',
        responsible: 'Leonor Rodrigues',
        manager_name: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Helena Ramos'],
        team_members: ['Leonor Rodrigues', 'Helena Ramos'],
        objective: 'Divulgação dos resultados ambientais e emissões de carbono do exercício fiscal de 2026.',
        description: 'Divulgação dos resultados ambientais e emissões de carbono do exercício fiscal de 2026.',
        target_journalist_ids: ['jour-1', 'jour-8'],
        target_journalists: ['Marta Figueiredo', 'Rita Valente'],
        target_outlets: ['Público', 'Expresso'],
        links_documents: [
          { label: 'Relatório Completo', url: 'https://ecopower.pt/relatorio-2026.pdf', type: 'briefing' }
        ],
        notes: 'Envio a jornalistas especializados em ambiente e energia.',
        progress: 75,
        done_tasks: 6,
        total_tasks: 8,
        is_overdue: false,
        created_at: '2026-11-05T08:30:00Z',
        updated_at: '2026-11-21T16:00:00Z'
      },
      {
        id: 'proj-4',
        name: 'Web Summit — media lounge',
        client: 'Grupo M',
        client_or_brand: 'Grupo M',
        type: 'evento',
        status: 'em_curso',
        priority: 'media',
        start_date: '2026-11-10',
        deadline: '2026-11-28',
        responsible: 'Tiago Mendes',
        manager_name: 'Tiago Mendes',
        team: ['Tiago Mendes', 'Carlos Silva'],
        team_members: ['Tiago Mendes', 'Carlos Silva'],
        objective: 'Acolhimento da imprensa no lounge oficial e agendamento de entrevistas com os oradores internacionais.',
        description: 'Acolhimento da imprensa no lounge oficial e agendamento de entrevistas com os oradores internacionais.',
        target_journalist_ids: ['jour-3', 'jour-9', 'jour-16'],
        target_journalists: ['Pedro Ramos', 'Tiago Mendes', 'Miguel Carmo'],
        target_outlets: ['ECO Economia Online', 'Observador'],
        links_documents: [
          { label: 'Programa de Entrevistas', url: 'https://grupom.pt/ws-schedule', type: 'briefing' }
        ],
        notes: 'Credenciais de imprensa entregues. Sessões de briefing todas as manhãs.',
        progress: 33,
        done_tasks: 3,
        total_tasks: 9,
        is_overdue: false,
        created_at: '2026-11-10T11:00:00Z',
        updated_at: '2026-11-21T17:30:00Z'
      },
      {
        id: 'proj-5',
        name: 'Expansão Ibérica 2026',
        client: 'Grupo M',
        client_or_brand: 'Grupo M',
        type: 'campanha',
        status: 'em_preparacao',
        priority: 'alta',
        start_date: '2026-11-22',
        deadline: '2026-12-12',
        responsible: 'Tiago Mendes',
        manager_name: 'Tiago Mendes',
        team: ['Tiago Mendes', 'Leonor Rodrigues', 'Helena Ramos', 'Carlos Silva'],
        team_members: ['Tiago Mendes', 'Leonor Rodrigues', 'Helena Ramos', 'Carlos Silva'],
        objective: 'Coordenação do anúncio ibérico e abertura de sede em Madrid com entrevistas exclusivas.',
        description: 'Coordenação do anúncio ibérico e abertura de sede em Madrid com entrevistas exclusivas.',
        target_journalist_ids: ['jour-1', 'jour-2'],
        target_journalists: ['Marta Figueiredo', 'Rui Almeida'],
        target_outlets: ['Público', 'Expresso'],
        links_documents: [
          { label: 'Dossiê Estratégico', url: 'https://docs.google.com/expansao-iberica', type: 'briefing' }
        ],
        notes: 'Preparação do comunicado ibérico e marcação de viagens.',
        progress: 8,
        done_tasks: 1,
        total_tasks: 12,
        is_overdue: false,
        created_at: '2026-11-22T08:00:00Z',
        updated_at: '2026-11-22T09:00:00Z'
      },
      {
        id: 'proj-6',
        name: 'Campanha de Natal',
        client: 'Casa Alfama',
        client_or_brand: 'Casa Alfama',
        type: 'campanha',
        status: 'em_pausa',
        priority: 'baixa',
        start_date: '2026-11-12',
        deadline: '2026-12-19',
        responsible: 'Helena Ramos',
        manager_name: 'Helena Ramos',
        team: ['Helena Ramos'],
        team_members: ['Helena Ramos'],
        objective: 'Campanha de divulgação dos produtos tradicionais e apoios de solidariedade para a época festiva.',
        description: 'Campanha de divulgação dos produtos tradicionais e apoios de solidariedade para a época festiva.',
        target_journalist_ids: ['jour-10'],
        target_journalists: ['Bernardo Silva'],
        target_outlets: ['TSF Rádio Notícias'],
        links_documents: [
          { label: 'Catálogo de Natal', url: 'https://casaalfama.pt/natal', type: 'briefing' }
        ],
        notes: 'Em pausa a aguardar confirmação de stocks dos fornecedores.',
        progress: 20,
        done_tasks: 2,
        total_tasks: 10,
        is_overdue: false,
        created_at: '2026-11-12T14:00:00Z',
        updated_at: '2026-11-20T10:00:00Z'
      },
      {
        id: 'proj-7',
        name: 'Lançamento da app Lumina',
        client: 'Lumina Labs',
        client_or_brand: 'Lumina Labs',
        type: 'lancamento',
        status: 'em_preparacao',
        priority: 'media',
        start_date: '2026-11-20',
        deadline: '2027-01-15',
        responsible: 'Leonor Rodrigues',
        manager_name: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Carlos Silva'],
        team_members: ['Leonor Rodrigues', 'Carlos Silva'],
        objective: 'Apresentação da aplicação móvel de inteligência de crédito para pequenas e médias empresas.',
        description: 'Apresentação da aplicação móvel de inteligência de crédito para pequenas e médias empresas.',
        target_journalist_ids: ['jour-9', 'jour-16'],
        target_journalists: ['Tiago Mendes', 'Miguel Carmo'],
        target_outlets: ['ECO Economia Online', 'Observador'],
        links_documents: [
          { label: 'Demo Kit App', url: 'https://luminalabs.pt/demo', type: 'briefing' }
        ],
        notes: 'Fase de testes beta fechada com influenciadores e analistas.',
        progress: 0,
        done_tasks: 0,
        total_tasks: 7,
        is_overdue: false,
        created_at: '2026-11-20T09:30:00Z',
        updated_at: '2026-11-21T11:00:00Z'
      },
      {
        id: 'proj-8',
        name: 'Dossiê de imprensa FinTech',
        client: 'Atlas Pay',
        client_or_brand: 'Atlas Pay',
        type: 'comunicado',
        status: 'concluido',
        priority: 'media',
        start_date: '2026-10-20',
        deadline: '2026-11-14',
        responsible: 'Carlos Silva',
        manager_name: 'Carlos Silva',
        team: ['Carlos Silva'],
        team_members: ['Carlos Silva'],
        objective: 'Envio de comunicado e dossiê analítico sobre a evolução das transferências bancárias instantâneas em Portugal.',
        description: 'Envio de comunicado e dossiê analítico sobre a evolução das transferências bancárias instantâneas em Portugal.',
        target_journalist_ids: ['jour-2', 'jour-6'],
        target_journalists: ['Rui Almeida', 'Gonçalo Neves'],
        target_outlets: ['Expresso', 'Jornal de Negócios'],
        links_documents: [
          { label: 'Dossiê Setorial FinTech', url: 'https://atlaspay.pt/dossier-2026.pdf', type: 'briefing' }
        ],
        notes: 'Dossiê concluído e publicado por múltiplos órgãos.',
        progress: 100,
        done_tasks: 6,
        total_tasks: 6,
        is_overdue: false,
        created_at: '2026-10-20T10:00:00Z',
        updated_at: '2026-11-14T17:00:00Z'
      }
    ];
'@

$html = $html.Substring(0, $pStartPos) + $newProjectsData + "`n`n    " + $html.Substring($pEndPos)
Write-Host "Replaced DEFAULT_SAMPLE_PROJECTS successfully."

# 4. Bump localStorage caching key from rep_projects_v5 to rep_projects_v6
$html = $html.Replace("'rep_projects_v5'", "'rep_projects_v6'")
Write-Host "Bumped projects storage key to rep_projects_v6."

# 5. Replace Project Functions in Script
$fnStartMarker = "    let currentProjectsViewMode = 'list'; // 'list' | 'kanban'"
$fnEndMarker = "    // ========================================================`r`n    // RENDERIZAÇÃO COMPLETA DE TAREFAS (MÓDULO 2)"
if ($html.IndexOf($fnEndMarker) -lt 0) {
    $fnEndMarker = "    // ========================================================`n    // RENDERIZAÇÃO COMPLETA DE TAREFAS (MÓDULO 2)"
}

$fnStartPos = $html.IndexOf($fnStartMarker)
$fnEndPos = $html.IndexOf($fnEndMarker)
if ($fnStartPos -lt 0 -or $fnEndPos -lt 0) {
    throw "Project script functions markers not found: fnStartPos=$fnStartPos, fnEndPos=$fnEndPos"
}

$newProjectFunctions = @'
    let currentProjectsViewMode = 'list'; // 'list' | 'kanban'
    let currentProjStatusFilter = 'all';
    let currentProjClientFilter = 'all';
    let currentProjRespFilter = 'all';
    let currentProjPriorityFilter = 'all';
    let currentProjSearchQuery = '';

    currentTaskTab = 'all'; // 'all' | 'today' | 'week' | 'overdue' | 'my'
    let currentTaskGrouping = 'none'; // 'none' | 'project' | 'due_date'

    let activeProjectDetailTab = 'overview'; // 'overview' | 'tasks' | 'journalists'

    // Formatação de Badges
    function getProjectStatusBadge(status) {
      const map = {
        'em_preparacao': { bg: '#EDE6DE', text: '#5C554E', label: 'Em preparação' },
        'em_curso': { bg: '#E3EFE3', text: '#2F6B3A', label: 'Em curso' },
        'in_progress': { bg: '#E3EFE3', text: '#2F6B3A', label: 'Em curso' },
        'aguarda_aprovacao': { bg: '#FEF8E7', text: '#805B00', label: 'A aguardar aprovação' },
        'concluido': { bg: '#D0E6D0', text: '#1E4D25', label: 'Concluído' },
        'completed': { bg: '#D0E6D0', text: '#1E4D25', label: 'Concluído' },
        'em_pausa': { bg: '#DDE6EE', text: '#2F4A63', label: 'Em pausa' },
        'on_hold': { bg: '#DDE6EE', text: '#2F4A63', label: 'Em pausa' }
      };
      const conf = map[status] || { bg: '#EDE6DE', text: '#5C554E', label: status || '—' };
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium" style="background-color: ${conf.bg}; color: ${conf.text};">${conf.label}</span>`;
    }

    function getProjectTypeBadge(type) {
      const map = {
        'lancamento': 'Lançamento',
        'evento': 'Evento',
        'comunicado': 'Comunicado',
        'entrevista': 'Entrevista',
        'campanha': 'Campanha',
        'crise': 'Gestão de crise'
      };
      return map[type] || type || 'Geral';
    }

    function getProjectPriorityBadge(priority) {
      if (priority === 'alta') {
        return `<div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#A3281E]"></span><span class="text-xs text-[#1A1A1A]">Alta</span></div>`;
      }
      if (priority === 'baixa') {
        return `<div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#8A8A8A]"></span><span class="text-xs text-[#1A1A1A]">Baixa</span></div>`;
      }
      return `<div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#D97706]"></span><span class="text-xs text-[#1A1A1A]">Média</span></div>`;
    }

    function getUserAvatar(name) {
      const n = (name || '').toLowerCase();
      if (n.includes('tiago')) return { initials: 'TI', shortName: 'Tiago', color: '#6C1C37' };
      if (n.includes('leonor')) return { initials: 'LE', shortName: 'Leonor', color: '#8C5036' };
      if (n.includes('helena')) return { initials: 'HE', shortName: 'Helena', color: '#2D6A4F' };
      if (n.includes('carlos')) return { initials: 'CA', shortName: 'Carlos', color: '#2F4A63' };
      return { initials: (name || 'U').substring(0, 2).toUpperCase(), shortName: name || 'Utilizador', color: '#6C1C37' };
    }

    function formatShortDate(dateStr) {
      if (!dateStr) return '—';
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10);
        const month = months[parseInt(parts[1], 10) - 1] || '';
        return `${day} ${month}`;
      }
      return dateStr;
    }

    function getProjectDeliveryInfo(deadlineStr, status) {
      if (status === 'concluido' || status === 'completed') {
        return {
          dateFormatted: formatShortDate(deadlineStr),
          relativeText: 'entregue',
          isOverdue: false,
          textClass: 'text-[#8A8A8A]'
        };
      }
      if (!deadlineStr) {
        return { dateFormatted: '—', relativeText: '', isOverdue: false, textClass: 'text-[#8A8A8A]' };
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parts = deadlineStr.split('T')[0].split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      d.setHours(0, 0, 0, 0);

      const diffTime = d.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      const dateFormatted = formatShortDate(deadlineStr);

      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        return {
          dateFormatted,
          relativeText: overdueDays === 1 ? 'atrasado 1 dia' : `atrasado ${overdueDays} dias`,
          isOverdue: true,
          textClass: 'text-[#A3281E] font-medium'
        };
      } else if (diffDays === 0) {
        return {
          dateFormatted,
          relativeText: 'hoje',
          isOverdue: false,
          textClass: 'text-[#805B00] font-medium'
        };
      } else if (diffDays === 1) {
        return {
          dateFormatted,
          relativeText: 'amanhã',
          isOverdue: false,
          textClass: 'text-[#6B6B6B]'
        };
      } else {
        return {
          dateFormatted,
          relativeText: `em ${diffDays} dias`,
          isOverdue: false,
          textClass: 'text-[#6B6B6B]'
        };
      }
    }

    // Alternador de modo Lista / Quadro
    function setProjectsViewMode(mode) {
      currentProjectsViewMode = mode;
      const btnList = document.getElementById('btn-proj-view-list');
      const btnKanban = document.getElementById('btn-proj-view-kanban');
      const listContainer = document.getElementById('projects-list-container');
      const kanbanContainer = document.getElementById('projects-kanban-container');

      if (mode === 'list') {
        if (btnList) btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        if (btnKanban) btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.remove('hidden');
        kanbanContainer?.classList.add('hidden');
      } else {
        if (btnKanban) btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        if (btnList) btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.add('hidden');
        kanbanContainer?.classList.remove('hidden');
      }
      renderFullProjects();
    }

    // Separadores por estado
    function setProjectsStatusTab(status) {
      currentProjStatusFilter = status;
      const statuses = ['all', 'em_preparacao', 'em_curso', 'aguarda_aprovacao', 'em_pausa', 'concluido'];
      statuses.forEach(s => {
        const tabBtn = document.getElementById(`proj-tab-${s}`);
        const countSpan = document.getElementById(`proj-tab-count-${s}`);
        if (tabBtn) {
          if (s === status) {
            tabBtn.className = 'proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0';
            if (countSpan) countSpan.className = 'px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white';
          } else {
            tabBtn.className = 'proj-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0';
            if (countSpan) countSpan.className = 'text-[11px] font-normal text-[#8A8A8A]';
          }
        }
      });
      renderFullProjects();
    }

    function filterProjectsBySearch(val) {
      currentProjSearchQuery = (val || '').toLowerCase().trim();
      renderFullProjects();
    }

    function filterProjectsByClient(val) {
      currentProjClientFilter = val;
      renderFullProjects();
    }

    function filterProjectsByResponsible(val) {
      currentProjRespFilter = val;
      renderFullProjects();
    }

    function filterProjectsByPriority(val) {
      currentProjPriorityFilter = val;
      renderFullProjects();
    }

    function clearProjectFilters() {
      currentProjStatusFilter = 'all';
      currentProjClientFilter = 'all';
      currentProjRespFilter = 'all';
      currentProjPriorityFilter = 'all';
      currentProjSearchQuery = '';

      const searchInput = document.getElementById('filter-proj-search');
      if (searchInput) searchInput.value = '';
      const clientSel = document.getElementById('filter-proj-client');
      if (clientSel) clientSel.value = 'all';
      const respSel = document.getElementById('filter-proj-responsible');
      if (respSel) respSel.value = 'all';
      const prioSel = document.getElementById('filter-proj-priority');
      if (prioSel) prioSel.value = 'all';

      setProjectsStatusTab('all');
    }

    // ========================================================
    // RENDERIZAÇÃO COMPLETA DE PROJETOS (LISTA & KANBAN)
    // ========================================================
    function renderFullProjects() {
      // 1. Atualizar resumo do cabeçalho
      const summaryEl = document.getElementById('projects-summary-text');
      if (summaryEl) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in7Days = new Date(today);
        in7Days.setDate(today.getDate() + 7);
        in7Days.setHours(23, 59, 59, 999);

        let thisWeekCount = 0;
        let overdueCount = 0;

        localProjects.forEach(p => {
          const isCompleted = p.status === 'concluido' || p.status === 'completed';
          if (!p.deadline) return;
          const parts = p.deadline.split('T')[0].split('-');
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          d.setHours(0, 0, 0, 0);

          if (!isCompleted && d < today) {
            overdueCount++;
          } else if (!isCompleted && d >= today && d <= in7Days) {
            thisWeekCount++;
          }
        });

        const weekText = `${thisWeekCount} com entrega esta semana`;
        const overdueText = overdueCount === 1 ? '1 em atraso' : `${overdueCount} em atraso`;
        summaryEl.textContent = `${weekText} · ${overdueText}`;
      }

      // 2. Atualizar contadores das abas de estado
      const countAll = document.getElementById('proj-tab-count-all');
      if (countAll) countAll.innerText = localProjects.length;

      const countPrep = document.getElementById('proj-tab-count-em_preparacao');
      if (countPrep) countPrep.innerText = localProjects.filter(p => p.status === 'em_preparacao').length;

      const countCurso = document.getElementById('proj-tab-count-em_curso');
      if (countCurso) countCurso.innerText = localProjects.filter(p => p.status === 'em_curso' || p.status === 'in_progress').length;

      const countAprov = document.getElementById('proj-tab-count-aguarda_aprovacao');
      if (countAprov) countAprov.innerText = localProjects.filter(p => p.status === 'aguarda_aprovacao').length;

      const countPausa = document.getElementById('proj-tab-count-em_pausa');
      if (countPausa) countPausa.innerText = localProjects.filter(p => p.status === 'em_pausa' || p.status === 'on_hold').length;

      const countConc = document.getElementById('proj-tab-count-concluido');
      if (countConc) countConc.innerText = localProjects.filter(p => p.status === 'concluido' || p.status === 'completed').length;

      // 3. Atualizar dropdown de clientes
      const clientSelect = document.getElementById('filter-proj-client');
      if (clientSelect) {
        const clients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = `<option value="all">Todos os clientes</option>` +
          clients.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
      }

      // 4. Filtragem
      let filtered = [...localProjects];
      if (currentProjStatusFilter !== 'all') {
        filtered = filtered.filter(p => {
          if (currentProjStatusFilter === 'em_curso') return p.status === 'em_curso' || p.status === 'in_progress';
          if (currentProjStatusFilter === 'concluido') return p.status === 'concluido' || p.status === 'completed';
          if (currentProjStatusFilter === 'em_pausa') return p.status === 'em_pausa' || p.status === 'on_hold';
          return p.status === currentProjStatusFilter;
        });
      }
      if (currentProjClientFilter !== 'all') {
        filtered = filtered.filter(p => (p.client || p.client_or_brand) === currentProjClientFilter);
      }
      if (currentProjRespFilter !== 'all') {
        filtered = filtered.filter(p => (p.responsible || p.manager || p.manager_name) === currentProjRespFilter);
      }
      if (currentProjPriorityFilter !== 'all') {
        filtered = filtered.filter(p => p.priority === currentProjPriorityFilter);
      }
      if (currentProjSearchQuery) {
        filtered = filtered.filter(p => {
          const name = (p.name || '').toLowerCase();
          const client = (p.client || p.client_or_brand || '').toLowerCase();
          return name.includes(currentProjSearchQuery) || client.includes(currentProjSearchQuery);
        });
      }

      // 5. Ordenação: atrasados primeiro, depois por data de entrega, concluídos no fim
      filtered.sort((a, b) => {
        const isACompleted = a.status === 'concluido' || a.status === 'completed';
        const isBCompleted = b.status === 'concluido' || b.status === 'completed';
        if (isACompleted && !isBCompleted) return 1;
        if (!isACompleted && isBCompleted) return -1;
        if (isACompleted && isBCompleted) {
          return (b.deadline || '').localeCompare(a.deadline || '');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const partsA = (a.deadline || '9999-12-31').split('T')[0].split('-');
        const dateA = new Date(parseInt(partsA[0]), parseInt(partsA[1]) - 1, parseInt(partsA[2]));
        dateA.setHours(0, 0, 0, 0);

        const partsB = (b.deadline || '9999-12-31').split('T')[0].split('-');
        const dateB = new Date(parseInt(partsB[0]), parseInt(partsB[1]) - 1, parseInt(partsB[2]));
        dateB.setHours(0, 0, 0, 0);

        const isAOverdue = dateA < today;
        const isBOverdue = dateB < today;

        if (isAOverdue && !isBOverdue) return -1;
        if (!isAOverdue && isBOverdue) return 1;

        return dateA - dateB;
      });

      // 6. RENDERIZAR TABELA (Vista Lista)
      const tbody = document.getElementById('projects-table-body');
      if (tbody) {
        if (localProjects.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" class="py-16 text-center">
                <div class="max-w-xs mx-auto space-y-3">
                  <p class="text-xs text-[#6B6B6B]">Ainda não tens projetos</p>
                  <button onclick="openProjectModal()" class="px-4 py-2 rounded-full text-xs font-semibold bg-[#6C1C37] text-white hover:bg-[#56162C] transition-all cursor-pointer shadow-xs">
                    + Criar o primeiro projeto
                  </button>
                </div>
              </td>
            </tr>
          `;
        } else if (filtered.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" class="py-16 text-center">
                <div class="max-w-xs mx-auto space-y-2">
                  <p class="text-xs text-[#6B6B6B]">Nenhum projeto com estes filtros</p>
                  <button onclick="clearProjectFilters()" class="text-xs text-[#6C1C37] hover:underline font-medium cursor-pointer">
                    Limpar filtros
                  </button>
                </div>
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = filtered.map(proj => {
            const clientName = proj.client || proj.client_or_brand || 'Institucional';
            const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
            const userAvatar = getUserAvatar(manager);
            const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
            const deliveryInfo = getProjectDeliveryInfo(proj.deadline, proj.status);

            // Calcular progresso
            const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
            let doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
            let totalTasks = projTasks.length;
            if (totalTasks === 0 && proj.total_tasks) {
              doneTasks = proj.done_tasks || 0;
              totalTasks = proj.total_tasks;
            }
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

            // Linha com fundo vermelho claro se atrasado
            const rowBgClass = deliveryInfo.isOverdue ? 'bg-[#FDF6F5] hover:bg-[#FAEFEB]' : 'bg-white hover:bg-[#FBF9F6]';

            return `
              <tr class="${rowBgClass} transition-colors cursor-pointer group" onclick="openProjectDetail('${proj.id}')">
                
                <!-- 1. PROJETO -->
                <td class="py-3.5 px-5">
                  <div class="font-bold text-[#1A1A1A] group-hover:text-[#6C1C37] text-xs transition-colors">${proj.name}</div>
                  <div class="text-[11px] text-[#8A8A8A] mt-0.5">${clientName} · ${getProjectTypeBadge(proj.type)}</div>
                </td>

                <!-- 2. ESTADO -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  ${getProjectStatusBadge(proj.status)}
                </td>

                <!-- 3. PRIORIDADE -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  ${getProjectPriorityBadge(proj.priority)}
                </td>

                <!-- 4. ENTREGA -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="font-bold text-[#1A1A1A] text-xs">${deliveryInfo.dateFormatted}</div>
                  <div class="text-[11px] ${deliveryInfo.textClass}">${deliveryInfo.relativeText}</div>
                </td>

                <!-- 5. RESPONSÁVEL -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0" style="background-color: ${userAvatar.color};">${userAvatar.initials}</span>
                    <span class="text-xs text-[#1A1A1A] font-medium">${userAvatar.shortName}</span>
                  </div>
                </td>

                <!-- 6. PROGRESSO -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-24 sm:w-28 bg-[#EDE6DE] rounded-full h-1.5 overflow-hidden">
                      <div class="h-1.5 rounded-full transition-all duration-300" style="width: ${pct}%; background-color: ${isCompleted ? '#1E4D25' : '#6C1C37'};"></div>
                    </div>
                    <span class="text-xs text-[#6B6B6B] font-mono min-w-[28px]">${doneTasks}/${totalTasks}</span>
                  </div>
                </td>

                <!-- MENU ⋯ -->
                <td class="py-3.5 px-3 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                  <div class="relative inline-block text-left">
                    <button type="button" onclick="toggleProjectRowMenu(event, '${proj.id}')"
                      class="proj-row-menu-btn p-1.5 text-[#8A8A8A] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F0ECE7] transition-colors cursor-pointer" title="Mais opções">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/>
                      </svg>
                    </button>
                    
                    <div id="proj-row-menu-${proj.id}"
                      class="proj-row-menu-popover absolute right-0 top-full mt-1 w-36 bg-white border border-[#E4DDD3] rounded-xl shadow-lg hidden z-30 py-1 text-xs">
                      <button type="button" onclick="closeAllProjectMenus(); openProjectDetail('${proj.id}');"
                        class="w-full text-left px-3 py-1.5 hover:bg-[#FBF9F6] text-[#1A1A1A] flex items-center gap-2 cursor-pointer">
                        Abrir
                      </button>
                      <button type="button" onclick="closeAllProjectMenus(); openProjectDetail('${proj.id}');"
                        class="w-full text-left px-3 py-1.5 hover:bg-[#FBF9F6] text-[#1A1A1A] flex items-center gap-2 cursor-pointer">
                        Editar
                      </button>
                      <button type="button" onclick="closeAllProjectMenus(); duplicateProject('${proj.id}');"
                        class="w-full text-left px-3 py-1.5 hover:bg-[#FBF9F6] text-[#1A1A1A] flex items-center gap-2 cursor-pointer">
                        Duplicar
                      </button>
                      <button type="button" onclick="closeAllProjectMenus(); archiveProject('${proj.id}');"
                        class="w-full text-left px-3 py-1.5 hover:bg-[#FBF9F6] text-[#1A1A1A] flex items-center gap-2 cursor-pointer border-t border-[#E4DDD3]/60">
                        Arquivar
                      </button>
                    </div>
                  </div>
                </td>

              </tr>
            `;
          }).join('');
        }
      }

      // 7. RENDERIZAR QUADRO KANBAN (5 Colunas por Estado)
      const kanbanContainer = document.getElementById('projects-kanban-container');
      if (kanbanContainer) {
        const columns = [
          { id: 'em_preparacao', title: 'Em preparação', bg: '#FBF9F6' },
          { id: 'em_curso', title: 'Em curso', bg: '#FBF9F6' },
          { id: 'aguarda_aprovacao', title: 'A aguardar aprovação', bg: '#FBF9F6' },
          { id: 'em_pausa', title: 'Em pausa', bg: '#FBF9F6' },
          { id: 'concluido', title: 'Concluído', bg: '#FBF9F6' }
        ];

        kanbanContainer.innerHTML = columns.map(col => {
          const colProjects = filtered.filter(p => {
            if (col.id === 'em_curso') return p.status === 'em_curso' || p.status === 'in_progress';
            if (col.id === 'concluido') return p.status === 'concluido' || p.status === 'completed';
            if (col.id === 'em_pausa') return p.status === 'em_pausa' || p.status === 'on_hold';
            return p.status === col.id;
          });

          return `
            <div class="bg-[#F8F5F1] rounded-2xl border border-[#E4DDD3] p-3 flex flex-col space-y-3 min-h-[450px]">
              <div class="flex items-center justify-between px-1 pb-2 border-b border-[#E4DDD3]/70">
                <span class="text-xs font-semibold text-[#1A1A1A] font-title">${col.title}</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E4DDD3] text-[#1A1A1A]">${colProjects.length}</span>
              </div>

              <div class="space-y-3 flex-1 overflow-y-auto">
                ${colProjects.length === 0 ? `
                  <div class="py-8 text-center text-xs text-[#6B6B6B] border border-dashed border-[#E4DDD3] rounded-xl p-3">
                    Sem projetos nesta fase.
                  </div>
                ` : colProjects.map(proj => {
                  const clientName = proj.client || proj.client_or_brand || 'Institucional';
                  const deliveryInfo = getProjectDeliveryInfo(proj.deadline, proj.status);
                  const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
                  const userAvatar = getUserAvatar(manager);

                  const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
                  let doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
                  let totalTasks = projTasks.length;
                  if (totalTasks === 0 && proj.total_tasks) {
                    doneTasks = proj.done_tasks || 0;
                    totalTasks = proj.total_tasks;
                  }
                  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

                  return `
                    <div onclick="openProjectDetail('${proj.id}')"
                      class="crm-card p-4 space-y-3 hover:border-[#6C1C37]/40 hover:shadow-md transition-all cursor-pointer group bg-white">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[11px] text-[#8A8A8A] font-medium truncate">${clientName}</span>
                        <div>${getProjectPriorityBadge(proj.priority)}</div>
                      </div>

                      <h4 class="text-xs font-bold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors leading-snug">
                        ${proj.name}
                      </h4>

                      <div class="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
                        <span>${getProjectTypeBadge(proj.type)}</span>
                      </div>

                      <!-- Prazo & Atraso -->
                      <div class="text-[11px] flex items-center justify-between pt-1 border-t border-[#E4DDD3]/60">
                        <span class="text-[#6B6B6B]">Entrega:</span>
                        <div class="text-right">
                          <span class="font-bold text-[#1A1A1A]">${deliveryInfo.dateFormatted}</span>
                          <span class="block ${deliveryInfo.textClass}">${deliveryInfo.relativeText}</span>
                        </div>
                      </div>

                      <!-- Progresso -->
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] text-[#6B6B6B]">
                          <span>Tarefas: ${doneTasks}/${totalTasks}</span>
                          <span class="font-medium text-[#1A1A1A]">${pct}%</span>
                        </div>
                        <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                          <div class="h-1.5 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
                        </div>
                      </div>

                      <!-- Responsável & Mover -->
                      <div class="flex items-center justify-between pt-1 border-t border-[#E4DDD3]/60 text-[11px]" onclick="event.stopPropagation()">
                        <div class="flex items-center gap-1.5">
                          <span class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white" style="background-color: ${userAvatar.color};">${userAvatar.initials}</span>
                          <span class="text-[#6B6B6B]">${userAvatar.shortName}</span>
                        </div>
                        <select onchange="updateProjectStatusQuick(event, '${proj.id}', this.value)" class="crm-select text-[10px] py-0.5 px-1.5 font-medium border-[#E4DDD3] bg-[#FBF9F6]">
                          <option value="em_preparacao" ${proj.status === 'em_preparacao' ? 'selected' : ''}>Mover: Preparação</option>
                          <option value="em_curso" ${(proj.status === 'em_curso' || proj.status === 'in_progress') ? 'selected' : ''}>Mover: Em curso</option>
                          <option value="aguarda_aprovacao" ${proj.status === 'aguarda_aprovacao' ? 'selected' : ''}>Mover: Aguarda aprovação</option>
                          <option value="em_pausa" ${(proj.status === 'em_pausa' || proj.status === 'on_hold') ? 'selected' : ''}>Mover: Em pausa</option>
                          <option value="concluido" ${(proj.status === 'concluido' || proj.status === 'completed') ? 'selected' : ''}>Mover: Concluído</option>
                        </select>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Menu contextual das linhas de projetos
    function toggleProjectRowMenu(e, projId) {
      e.stopPropagation();
      const menu = document.getElementById(`proj-row-menu-${projId}`);
      if (!menu) return;
      const isVisible = !menu.classList.contains('hidden');
      closeAllProjectMenus();
      if (!isVisible) {
        menu.classList.remove('hidden');
      }
    }

    function closeAllProjectMenus() {
      document.querySelectorAll('.proj-row-menu-popover').forEach(el => {
        el.classList.add('hidden');
      });
    }

    function duplicateProject(id) {
      const p = localProjects.find(item => item.id === id);
      if (!p) return;
      const copy = JSON.parse(JSON.stringify(p));
      copy.id = 'proj-' + Date.now();
      copy.name = copy.name + ' (Cópia)';
      copy.created_at = new Date().toISOString();
      copy.updated_at = new Date().toISOString();
      localProjects.unshift(copy);
      syncLocalStorage();
      renderFullProjects();
      showToast('Projeto duplicado com sucesso.');
    }

    function archiveProject(id) {
      const p = localProjects.find(item => item.id === id);
      if (!p) return;
      p.status = 'em_pausa';
      p.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderFullProjects();
      showToast('Projeto colocado em pausa.');
    }

    // Mudança rápida de estado no Kanban
    async function updateProjectStatusQuick(e, projId, newStatus) {
      e.stopPropagation();
      const proj = localProjects.find(p => p.id === projId);
      if (!proj) return;
      proj.status = newStatus;
      proj.updated_at = new Date().toISOString();

      if (supabaseClient) {
        try {
          await supabaseClient.from('projects').update({ status: newStatus }).eq('id', projId);
        } catch (err) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Estado do projeto atualizado.');
    }
'@

$html = $html.Substring(0, $fnStartPos) + $newProjectFunctions + "`n`n" + $html.Substring($fnEndPos)
Write-Host "Replaced project rendering script functions successfully."

# 6. Replace handleNewProjectSubmit and openProjectModal (Modal JS Logic)
$modalJsStartMarker = '    async function handleNewProjectSubmit(e) {'
$modalJsEndMarker = '    // Navegação para Detalhe de Projeto'

$mJsStartPos = $html.IndexOf($modalJsStartMarker)
$mJsEndPos = $html.IndexOf($modalJsEndMarker)
if ($mJsStartPos -lt 0 -or $mJsEndPos -lt 0) {
    throw "Modal JS functions markers not found: mJsStartPos=$mJsStartPos, mJsEndPos=$mJsEndPos"
}

$newModalJsFunctions = @'
    // Estado local para o formulário de Novo Projeto
    let modalSelectedTeam = ['Tiago Mendes'];
    let modalSelectedJourIds = [];

    function setNewProjectPriority(prio) {
      const pInput = document.getElementById('project-priority');
      if (pInput) pInput.value = prio;

      const prios = ['alta', 'media', 'baixa'];
      prios.forEach(p => {
        const btn = document.getElementById(`btn-prio-${p}`);
        if (btn) {
          if (p === prio) {
            btn.className = 'flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all cursor-pointer';
          } else {
            btn.className = 'flex-1 py-1.5 text-xs font-medium rounded-lg text-[#6B6B6B] transition-all cursor-pointer';
          }
        }
      });
    }

    function toggleNewProjectDetails() {
      const content = document.getElementById('new-project-details-content');
      const chevron = document.getElementById('new-project-details-chevron');
      if (!content) return;
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    }

    function renderTeamChips() {
      const container = document.getElementById('project-team-chips-container');
      if (!container) return;

      const members = [
        { name: 'Leonor Rodrigues', shortName: 'Leonor', initials: 'LE', color: '#8C5036' },
        { name: 'Tiago Mendes', shortName: 'Tiago', initials: 'TI', color: '#6C1C37' },
        { name: 'Helena Ramos', shortName: 'Helena', initials: 'HE', color: '#2D6A4F' },
        { name: 'Carlos Silva', shortName: 'Carlos', initials: 'CA', color: '#2F4A63' }
      ];

      container.innerHTML = members.map(m => {
        const isSelected = modalSelectedTeam.includes(m.name);
        const borderClass = isSelected ? 'border-[#1A1A1A] bg-[#FAF8F5] shadow-xs' : 'border-[#E4DDD3] bg-white hover:border-[#1A1A1A]/40';
        return `
          <button type="button" onclick="toggleTeamMemberChip('${m.name}')"
            class="px-3 py-1.5 rounded-full border ${borderClass} flex items-center gap-2 cursor-pointer transition-all">
            <span class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white shrink-0" style="background-color: ${m.color};">${m.initials}</span>
            <span class="text-xs text-[#1A1A1A] font-medium">${m.shortName}</span>
          </button>
        `;
      }).join('');
    }

    function toggleTeamMemberChip(name) {
      if (modalSelectedTeam.includes(name)) {
        if (modalSelectedTeam.length > 1) {
          modalSelectedTeam = modalSelectedTeam.filter(m => m !== name);
        }
      } else {
        modalSelectedTeam.push(name);
      }
      renderTeamChips();
    }

    function onProjectResponsibleChange(val) {
      if (!modalSelectedTeam.includes(val)) {
        modalSelectedTeam.push(val);
      }
      renderTeamChips();
    }

    function onProjectClientInput(val) {
      const container = document.getElementById('project-client-suggestions');
      if (!container) return;
      const q = (val || '').toLowerCase().trim();
      const existingClients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
      const matches = existingClients.filter(c => c.toLowerCase().includes(q));

      let items = matches.map(c => `
        <div onclick="selectNewProjectClient('${c}')" class="px-3 py-2 text-xs hover:bg-[#F0ECE7] cursor-pointer text-[#1A1A1A]">
          ${c}
        </div>
      `);

      if (q && !matches.some(c => c.toLowerCase() === q)) {
        items.push(`
          <div onclick="selectNewProjectClient('${val.trim()}')" class="px-3 py-2 text-xs hover:bg-[#F0ECE7] cursor-pointer text-[#6C1C37] font-semibold border-t border-[#E4DDD3]/60">
            Criar «${val.trim()}»
          </div>
        `);
      }

      if (items.length === 0) {
        container.classList.add('hidden');
        return;
      }

      container.innerHTML = items.join('');
      container.classList.remove('hidden');
    }

    function selectNewProjectClient(clientName) {
      const clientInput = document.getElementById('project-client');
      if (clientInput) clientInput.value = clientName;
      const container = document.getElementById('project-client-suggestions');
      if (container) container.classList.add('hidden');
      checkNewProjectFormValidity();
    }

    function onProjectJourSearchInput(val) {
      const container = document.getElementById('project-jour-search-results');
      if (!container) return;
      const q = (val || '').toLowerCase().trim();
      if (!q) {
        container.classList.add('hidden');
        return;
      }

      const matches = localJournalists.filter(j => {
        if (modalSelectedJourIds.includes(j.id)) return false;
        const name = (j.name || '').toLowerCase();
        const outlet = (j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '').toLowerCase();
        const areas = (j.intervention_areas || []).join(' ').toLowerCase();
        return name.includes(q) || outlet.includes(q) || areas.includes(q);
      });

      if (matches.length === 0) {
        container.innerHTML = '<div class="px-3 py-2 text-xs text-[#8A8A8A]">Nenhum jornalista encontrado.</div>';
        container.classList.remove('hidden');
        return;
      }

      container.innerHTML = matches.slice(0, 6).map(j => {
        const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral';
        return `
          <div onclick="addModalSelectedJournalist('${j.id}')" class="px-3 py-2 text-xs hover:bg-[#F0ECE7] cursor-pointer flex items-center justify-between">
            <span class="font-medium text-[#1A1A1A]">${j.name} <span class="text-[#8A8A8A]">· ${outlet}</span></span>
            <span class="text-[10px] text-[#8A8A8A]">${(j.intervention_areas && j.intervention_areas[0]) || ''}</span>
          </div>
        `;
      }).join('');
      container.classList.remove('hidden');
    }

    function addModalSelectedJournalist(jid) {
      if (!modalSelectedJourIds.includes(jid)) {
        modalSelectedJourIds.push(jid);
      }
      const searchInput = document.getElementById('project-jour-search-input');
      if (searchInput) searchInput.value = '';
      const container = document.getElementById('project-jour-search-results');
      if (container) container.classList.add('hidden');
      renderSelectedJournalistChips();
    }

    function removeModalSelectedJournalist(jid) {
      modalSelectedJourIds = modalSelectedJourIds.filter(id => id !== jid);
      renderSelectedJournalistChips();
    }

    function renderSelectedJournalistChips() {
      const container = document.getElementById('project-selected-journalists-chips');
      if (!container) return;

      container.innerHTML = modalSelectedJourIds.map(jid => {
        const j = localJournalists.find(item => item.id === jid);
        if (!j) return '';
        const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '';
        return `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0ECE7] text-[#1A1A1A] rounded-full text-xs font-medium">
            <span>${j.name}${outlet ? ' · ' + outlet : ''}</span>
            <button type="button" onclick="removeModalSelectedJournalist('${j.id}')"
              class="text-[#8A8A8A] hover:text-[#1A1A1A] font-bold text-sm leading-none cursor-pointer">×</button>
          </span>
        `;
      }).join('');
    }

    function checkNewProjectFormValidity() {
      const name = document.getElementById('project-name')?.value.trim();
      const client = document.getElementById('project-client')?.value.trim();
      const type = document.getElementById('project-type')?.value;
      const deadline = document.getElementById('project-deadline')?.value;
      const responsible = document.getElementById('project-responsible')?.value;

      const submitBtn = document.getElementById('btn-submit-new-project');
      if (!submitBtn) return;

      const isValid = Boolean(name && client && type && deadline && responsible);
      submitBtn.disabled = !isValid;
      if (isValid) {
        submitBtn.classList.remove('opacity-40', 'cursor-not-allowed');
      } else {
        submitBtn.classList.add('opacity-40', 'cursor-not-allowed');
      }
    }

    function openProjectModal() {
      if (!currentUserPermissions()?.canCreateProjects) {
        showToast('Acesso Restrito: A criação de projetos é reservada à Direção de RP.');
        return;
      }

      // Resetar formulário
      const form = document.getElementById('form-new-project');
      if (form) form.reset();

      // Definir datas iniciais
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const startDateInput = document.getElementById('project-start-date');
      if (startDateInput) startDateInput.value = todayStr;

      // Prioridade por defeito Média
      setNewProjectPriority('media');

      // Responsável e equipa
      const user = currentUser();
      const defaultResp = user?.name || 'Tiago Mendes';
      const respSelect = document.getElementById('project-responsible');
      if (respSelect) respSelect.value = defaultResp;

      modalSelectedTeam = [defaultResp];
      renderTeamChips();

      // Jornalistas alvo
      modalSelectedJourIds = [];
      renderSelectedJournalistChips();

      // Verificar validade dos 5 campos
      checkNewProjectFormValidity();

      document.getElementById('modal-new-project').classList.remove('hidden');
      document.getElementById('modal-new-project').classList.add('flex');
    }

    function closeProjectModal() {
      document.getElementById('modal-new-project').classList.add('hidden');
      document.getElementById('modal-new-project').classList.remove('flex');
    }

    async function handleNewProjectSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('project-name').value.trim();
      const client = document.getElementById('project-client').value.trim() || 'Institucional';
      const type = document.getElementById('project-type').value;
      const status = 'em_preparacao'; // Estado inicial fixo por especificação
      const priority = document.getElementById('project-priority').value || 'media';
      const start_date = document.getElementById('project-start-date').value || new Date().toISOString().split('T')[0];
      const deadline = document.getElementById('project-deadline').value;
      const responsible = document.getElementById('project-responsible').value;

      if (!name || !client || !type || !deadline || !responsible) {
        showToast('Por favor preenche todos os campos obrigatórios (*).');
        return;
      }

      // Equipa selecionada
      let team = [...modalSelectedTeam];
      if (!team.includes(responsible)) team.unshift(responsible);

      const objective = document.getElementById('project-objective').value.trim();

      // Jornalistas-alvo selecionados
      const target_journalist_ids = [...modalSelectedJourIds];
      const target_journalists = target_journalist_ids.map(jid => {
        const j = localJournalists.find(item => item.id === jid);
        return j ? j.name : '';
      }).filter(Boolean);

      // Meios-alvo derivados automaticamente
      const derivedOutlets = new Set();
      target_journalist_ids.forEach(jid => {
        const j = localJournalists.find(item => item.id === jid);
        if (j) {
          if (j.outlet_name) derivedOutlets.add(j.outlet_name);
          if (j.outlet_names) j.outlet_names.forEach(o => derivedOutlets.add(o));
        }
      });
      const target_outlets = [...derivedOutlets];

      // Links
      const linkBriefing = document.getElementById('project-link-briefing').value.trim();
      const linkFolder = document.getElementById('project-link-folder').value.trim();
      const links_documents = [];
      if (linkBriefing) links_documents.push({ label: 'Briefing Executivo', url: linkBriefing, type: 'briefing' });
      if (linkFolder) links_documents.push({ label: 'Pasta Partilhada', url: linkFolder, type: 'pasta' });

      const newProj = {
        id: 'proj-' + Date.now(),
        name,
        client,
        client_or_brand: client,
        type,
        status,
        priority,
        start_date,
        deadline,
        responsible,
        manager: responsible,
        manager_name: responsible,
        team,
        team_members: team,
        objective,
        description: objective,
        target_journalist_ids,
        target_journalists,
        target_outlets,
        links_documents,
        notes: '',
        progress: 0,
        done_tasks: 0,
        total_tasks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('projects').insert([newProj]).select();
          if (!error && data && data[0]) newProj.id = data[0].id;
        } catch (err) { }
      }

      localProjects.unshift(newProj);
      syncLocalStorage();
      closeProjectModal();
      renderAll();
      showToast('Projeto criado com sucesso.');

      // Abre imediatamente a ficha do projeto criado
      openProjectDetail(newProj.id);
    }

    // Abertura e fecho de modais de tarefas
    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          localProjects.map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand})</option>`).join('');
      }

      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista...</option>' +
          localJournalists.map(j => `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'})</option>`).join('');
      }

      const today = new Date();
      document.getElementById('task-due-date').value = today.toISOString().split('T')[0];

      document.getElementById('modal-new-task').classList.remove('hidden');
      document.getElementById('modal-new-task').classList.add('flex');
    }

    function closeTaskModal() {
      document.getElementById('modal-new-task').classList.add('hidden');
      document.getElementById('modal-new-task').classList.remove('flex');
    }

    // Fechar popovers e sugestões ao clicar fora
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.proj-row-menu-btn') && !e.target.closest('.proj-row-menu-popover')) {
        closeAllProjectMenus();
      }
      if (!e.target.closest('#project-client') && !e.target.closest('#project-client-suggestions')) {
        const sug = document.getElementById('project-client-suggestions');
        if (sug) sug.classList.add('hidden');
      }
      if (!e.target.closest('#project-jour-search-input') && !e.target.closest('#project-jour-search-results')) {
        const res = document.getElementById('project-jour-search-results');
        if (res) res.classList.add('hidden');
      }
    });

'@

$html = $html.Substring(0, $mJsStartPos) + $newModalJsFunctions + "`n`n    " + $html.Substring($mJsEndPos)
Write-Host "Replaced modal JS script functions successfully."

# Write to both dashboard.html and index.html
[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Both dashboard.html and index.html successfully updated!"
