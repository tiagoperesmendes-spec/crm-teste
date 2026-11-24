$filePath = "dashboard.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Encontrar o início do bloco da sidebar
$startMarker = '<!-- ESPAÇOS DE TRABALHO (EXATAMENTE COMO IMAGEM 3) -->'
$startIndex = $content.IndexOf($startMarker)
if ($startIndex -lt 0) {
    Write-Error "Start marker not found!"
    exit 1
}
# Voltar um pouco para apanhar o comentário antes se houver
$preStartMarker = "<!-- ========================================== -->`r`n        $startMarker"
if ($content.Contains($preStartMarker)) {
    $startIndex = $content.IndexOf($preStartMarker)
} else {
    $preStartMarker = "<!-- ========================================== -->`n        $startMarker"
    if ($content.Contains($preStartMarker)) {
        $startIndex = $content.IndexOf($preStartMarker)
    }
}

# 2. Encontrar o fim do cabeçalho
$endMarker = '</header>'
$endIndex = $content.IndexOf($endMarker, $startIndex)
if ($endIndex -lt 0) {
    Write-Error "End marker </header> not found!"
    exit 1
}
$endIndex += $endMarker.Length

$oldSection = $content.Substring($startIndex, $endIndex - $startIndex)

$newSection = @'
<!-- Botões de ação globais ocultos (compatibilidade funcional segura) -->
        <div class="hidden">
          <button id="sidebar-btn-new-task" onclick="openTaskModal()"></button>
          <button id="sidebar-btn-new-project" onclick="openProjectModal()"></button>
          <button id="sidebar-btn-new-contact" onclick="openContactModal()"></button>
        </div>

        <!-- ========================================== -->
        <!-- NAVEGAÇÃO PRINCIPAL                       -->
        <!-- Painel, Projetos, Tarefas                 -->
        <!-- ========================================== -->
        <div class="space-y-1">
          <!-- 1. Painel (Dashboard) -->
          <button onclick="switchView('dashboard')" id="nav-dashboard"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#1A1A1A] shadow-xs border border-[#E4DDD3]/70 transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#6C1C37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                </path>
              </svg>
              <span>Painel</span>
            </div>
          </button>

          <!-- 2. Projetos -->
          <button onclick="switchView('projects')" id="nav-projects"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z">
                </path>
              </svg>
              <span>Projetos</span>
            </div>
            <span id="sidebar-projects-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono">6</span>
          </button>

          <!-- 3. Tarefas -->
          <button onclick="switchView('tasks')" id="nav-tasks"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                </path>
              </svg>
              <span>Tarefas</span>
            </div>
            <span id="sidebar-tasks-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono">20</span>
          </button>
        </div>

        <!-- ========================================== -->
        <!-- BASES DE DADOS                             -->
        <!-- Jornalistas, Meios                         -->
        <!-- ========================================== -->
        <div class="space-y-1 pt-4 border-t border-[#E4DDD3]">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A] mb-2 px-2">Bases de Dados</p>

          <!-- 4. Jornalistas -->
          <button onclick="switchView('journalists')" id="nav-journalists"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                </path>
              </svg>
              <span>Jornalistas</span>
            </div>
            <span id="sidebar-journalists-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono">20</span>
          </button>

          <!-- 5. Meios -->
          <button onclick="switchView('outlets')" id="nav-outlets"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                </path>
              </svg>
              <span>Meios</span>
            </div>
            <span id="sidebar-outlets-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono">10</span>
          </button>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- ZONA DE UTILIZADOR NO CANTO INFERIOR       -->
      <!-- NOME, POSIÇÃO E OPÇÃO DE LOGOUT COM ÍCONE  -->
      <!-- (CONFORME DESIGN SOLICITADO)               -->
      <!-- ========================================== -->
      <div class="pt-4 border-t border-[#E4DDD3]">
        <div class="p-2.5 rounded-2xl bg-white border border-[#E4DDD3] flex items-center justify-between shadow-2xs hover:border-[#6C1C37]/30 transition-all">
          <div class="flex items-center gap-2.5 min-w-0">
            <!-- Avatar Inicial com tom terracota / bordô -->
            <div class="w-8 h-8 rounded-full bg-[#9E4A28] text-white flex items-center justify-center text-xs font-semibold shrink-0 auth-user-initials font-title shadow-2xs">
              TM
            </div>
            <div class="min-w-0">
              <span class="text-xs font-semibold text-[#1A1A1A] block truncate" id="sidebar-user-name">Tiago Mendes</span>
              <span class="text-[11px] text-[#8C827A] block truncate" id="sidebar-user-title">Diretor de RP</span>
            </div>
          </div>
          <!-- Botão de Logout com Ícone -->
          <button onclick="handleSignOut()" class="text-[#8A8A8A] hover:text-[#A3281E] p-1.5 rounded-lg hover:bg-[#F6F2EC] transition-colors cursor-pointer shrink-0" title="Terminar Sessão">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ========================================== -->
    <!-- ÁREA DE CONTEÚDO PRINCIPAL                 -->
    <!-- ========================================== -->
    <main class="flex-1 flex flex-col min-w-0 bg-[#EDE6DE]" id="section-top">

      <!-- CABEÇALHO APENAS MOBILE (EM DESKTOP NÃO OCUPA ESPAÇO) -->
      <header class="flex md:hidden px-4 py-3 bg-[#FBF9F6] border-b border-[#E4DDD3] items-center justify-between sticky top-0 z-30">
        <img src="logo-modo.png" alt="MODO" class="h-6 object-contain mix-blend-multiply" />
        <button onclick="toggleSidebar(true)" class="p-2 rounded-xl text-[#1A1A1A] hover:bg-[#EDE6DE] transition-colors" title="Abrir Menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </header>

      <!-- Elementos ocultos para manter compatibilidade funcional com switchView e RBAC -->
      <div class="hidden">
        <h1 id="page-title">Dashboard</h1>
        <p id="page-subtitle"></p>
        <span id="header-user-dot"></span>
        <span id="header-user-role"></span>
        <span id="header-user-email"></span>
      </div>
'@

$newContent = $content.Substring(0, $startIndex) + $newSection + $content.Substring($endIndex)

# Atualizar também o JavaScript em setAuthenticatedUser e applyUserPermissions para garantir sincronização do nome e cargo
$oldSetAuth = "document.querySelectorAll('.auth-user-initials').forEach(el => el.innerText = initials);"
$newSetAuth = @'
document.querySelectorAll('.auth-user-initials').forEach(el => el.innerText = initials);
      const sidebarName = document.getElementById('sidebar-user-name');
      const sidebarTitle = document.getElementById('sidebar-user-title');
      if (sidebarName) sidebarName.innerText = name;
      if (sidebarTitle) sidebarTitle.innerText = ROLE_PERMISSIONS[role]?.fullTitle || ROLE_PERMISSIONS[role]?.label || 'Diretor(a) de RP';
'@
$newContent = $newContent.Replace($oldSetAuth, $newSetAuth)

# Atualizar applyUserPermissions para também sincronizar o cargo na barra lateral
$oldApplyPerms = "const sidebarBadge = document.getElementById('sidebar-role-badge');"
$newApplyPerms = @'
const sidebarBadge = document.getElementById('sidebar-role-badge');
      const sidebarTitle = document.getElementById('sidebar-user-title');
      if (sidebarTitle) sidebarTitle.innerText = perms.fullTitle || perms.label;
'@
$newContent = $newContent.Replace($oldApplyPerms, $newApplyPerms)

# Gravar nos dois ficheiros
[System.IO.File]::WriteAllText("dashboard.html", $newContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("index.html", $newContent, [System.Text.Encoding]::UTF8)

Write-Output "Successfully updated dashboard.html and index.html!"
Write-Output "dashboard.html size: $($newContent.Length)"
