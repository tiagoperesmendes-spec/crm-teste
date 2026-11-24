$filePath = "dashboard.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. SUBSTITUIÇÃO NA VISTA DOS JORNALISTAS (view-journalists)
$jStartMarker = '<!-- Barra de Ferramentas: Pesquisa e Filtros Attio-Style -->'
$jEndMarker = '<tbody id="journalists-table-body">'

$jStartIndex = $content.IndexOf($jStartMarker)
if ($jStartIndex -lt 0) {
    Write-Error "Journalists start marker not found!"
    exit 1
}

$jEndIndex = $content.IndexOf($jEndMarker, $jStartIndex)
if ($jEndIndex -lt 0) {
    Write-Error "Journalists end marker not found!"
    exit 1
}

$newJournalistsSection = @'
<!-- Barra de Ferramentas Limpa (Pesquisa + Exportar Dados + Adicionar Jornalista) -->
        <div class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Barra de Pesquisa Rápida -->
            <div class="relative flex-1 max-w-md">
              <input type="text" id="search-journalists" onkeyup="filterJournalistsTable()"
                placeholder="Pesquisar por nome, cargo, OCS, área ou notas..."
                class="crm-input pl-9 pr-3 py-2 text-xs">
              <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Botões de Ação: Exportar Dados e Adicionar Jornalista -->
            <div class="flex items-center gap-2">
              <!-- Exportar Dados -->
              <button onclick="exportJournalistsCsv()" class="btn-secondary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer" title="Exportar dados para CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Exportar dados</span>
              </button>

              <!-- + Adicionar Jornalista -->
              <button onclick="openJournalistModal()" id="view-journalists-add-btn"
                class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>+ Adicionar Jornalista</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tabela de Jornalistas (Base 2) -->
        <div class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="journalists-table">
              <thead>
                <tr>
                  <th onclick="sortJournalists('name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Nome do Jornalista</th>
                  <th id="th-jour-cargo" onclick="sortJournalists('role_title')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Cargo</th>
                  <th id="th-jour-ocs" onclick="sortJournalists('outlet_name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Órgão (OCS)</th>
                  <th id="th-jour-area">Área de Intervenção</th>
                  <th id="th-jour-contactos">Contactos Diretos</th>
                  <th id="th-jour-pref">Pref.</th>
                  <th id="th-jour-ultimo" onclick="sortJournalists('last_contact_date')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Último Contacto</th>
                  <th id="th-jour-rgpd">RGPD</th>
                  <th id="th-jour-estado" onclick="sortJournalists('status')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Estado</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              
'@

$content = $content.Substring(0, $jStartIndex) + $newJournalistsSection + $content.Substring($jEndIndex)

# 2. SUBSTITUIÇÃO NA VISTA DOS MEIOS / OCS (view-outlets)
$oStartMarker = '<!-- Barra de Ferramentas: Pesquisa e Filtros -->'
$oEndMarker = '<tbody id="outlets-table-body">'

$oStartIndex = $content.IndexOf($oStartMarker)
if ($oStartIndex -lt 0) {
    Write-Error "Outlets start marker not found!"
    exit 1
}

$oEndIndex = $content.IndexOf($oEndMarker, $oStartIndex)
if ($oEndIndex -lt 0) {
    Write-Error "Outlets end marker not found!"
    exit 1
}

$newOutletsSection = @'
<!-- Barra de Ferramentas Limpa (Pesquisa + Exportar Dados + Adicionar Órgão) -->
        <div class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Barra de Pesquisa Rápida -->
            <div class="relative flex-1 max-w-md">
              <input type="text" id="search-outlets" onkeyup="filterOutletsTable()"
                placeholder="Pesquisar por nome, grupo editorial, morada ou registo ERC..."
                class="crm-input pl-9 pr-3 py-2 text-xs">
              <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Botões de Ação: Exportar Dados e Adicionar Órgão (OCS) -->
            <div class="flex items-center gap-2">
              <!-- Exportar Dados -->
              <button onclick="exportOutletsCsv()" class="btn-secondary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer" title="Exportar dados de OCS para CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Exportar dados</span>
              </button>

              <!-- + Adicionar Órgão (OCS) -->
              <button onclick="openOutletModal()" id="view-outlets-add-btn"
                class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>+ Adicionar Meio</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Vista 1: Tabela de OCS (Base 1) -->
        <div id="outlets-table-view-container" class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="outlets-table">
              <thead>
                <tr>
                  <th onclick="sortOutlets('name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Órgão de Comunicação (OCS)</th>
                  <th id="th-ocs-grupo" onclick="sortOutlets('media_group')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Grupo Editorial</th>
                  <th id="th-ocs-formatos">Formatos</th>
                  <th id="th-ocs-ambito" onclick="sortOutlets('scope')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Âmbito & Periodicidade</th>
                  <th id="th-ocs-especialidade">Especialidade</th>
                  <th id="th-ocs-erc">Registo ERC</th>
                  <th id="th-ocs-agenda">Email Agenda / Contacto</th>
                  <th id="th-ocs-jornalistas">Jornalistas Associados</th>
                  <th id="th-ocs-estado" onclick="sortOutlets('status')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">Estado</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              
'@

$content = $content.Substring(0, $oStartIndex) + $newOutletsSection + $content.Substring($oEndIndex)

# 3. ATUALIZAR updateSortIcons PARA NÃO INSERIR ÍCONES
$oldSortIcons = 'function updateSortIcons() {'
$newSortIcons = @'
function updateSortIcons() {
      // Cabeçalhos limpos sem ícones adicionais
      return;
'@
$content = $content.Replace($oldSortIcons, $newSortIcons)

# Gravar nos dois ficheiros principais
[System.IO.File]::WriteAllText("dashboard.html", $content, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("index.html", $content, [System.Text.Encoding]::UTF8)

Write-Output "Successfully updated journalists and outlets toolbars and headers in dashboard.html and index.html!"
Write-Output "New dashboard.html size: $($content.Length)"
