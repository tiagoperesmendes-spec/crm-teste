$sourceHtmlPath = "dashboard.html"
$outputHtmlPath = "scratch/test_updated_dashboard.html"

Write-Output "Starting master build of CRM dashboard..."

$html = [System.IO.File]::ReadAllText($sourceHtmlPath, [System.Text.Encoding]::UTF8)

# 1. Update Sample Data: replace DEFAULT_SAMPLE_TASKS and DEFAULT_SAMPLE_PROJECTS
$mockJs = [System.IO.File]::ReadAllText("scratch/mock_projects_tasks.js", [System.Text.Encoding]::UTF8)
$projStart = $mockJs.IndexOf("const DEFAULT_SAMPLE_PROJECTS = [")
$taskStart = $mockJs.IndexOf("const DEFAULT_SAMPLE_TASKS = [")

$mockProjectsBlock = $mockJs.Substring($projStart, $taskStart - $projStart).Trim()
$mockTasksBlock = $mockJs.Substring($taskStart).Trim()

$origTaskStart = $html.IndexOf("    const DEFAULT_SAMPLE_TASKS = [")
if ($origTaskStart -lt 0) { throw "Could not find DEFAULT_SAMPLE_TASKS" }

$origProjStart = $html.IndexOf("    const DEFAULT_SAMPLE_PROJECTS = [")
if ($origProjStart -lt 0) { throw "Could not find DEFAULT_SAMPLE_PROJECTS" }

$origProjEnd = $html.IndexOf("    ];", $origProjStart)
if ($origProjEnd -lt 0) { throw "Could not find end of DEFAULT_SAMPLE_PROJECTS" }
$origProjEnd += 6

$newSampleData = "    " + $mockTasksBlock + "`r`n`r`n    " + $mockProjectsBlock

$html = $html.Substring(0, $origTaskStart) + $newSampleData + $html.Substring($origProjEnd)
Write-Output "Step 1: Sample data replaced."

# 2. Replace view-tasks and view-projects markup
$vTasksStart = $html.IndexOf('<div id="view-tasks"')
$vTasksCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vTasksStart)

$vJourStart = $html.IndexOf('<div id="view-journalists"')
$vJourCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vJourStart)

$newTasksProjectsMarkup = [System.IO.File]::ReadAllText("scratch/view_tasks_projects_markup.html", [System.Text.Encoding]::UTF8)
$html = $html.Substring(0, $vTasksCommentStart) + $newTasksProjectsMarkup + "`r`n`r`n" + $html.Substring($vJourCommentStart)
Write-Output "Step 2: view-tasks and view-projects markup replaced."

# 3. Replace view-project-detail markup
$vProjDetStart = $html.IndexOf('<div id="view-project-detail"')
$vProjDetCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vProjDetStart)

$vContactsStart = $html.IndexOf('<div id="view-contacts"')
$vContactsCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vContactsStart)

$newProjDetailMarkup = [System.IO.File]::ReadAllText("scratch/view_project_detail_markup.html", [System.Text.Encoding]::UTF8)
$html = $html.Substring(0, $vProjDetCommentStart) + $newProjDetailMarkup + "`r`n`r`n" + $html.Substring($vContactsCommentStart)
Write-Output "Step 3: view-project-detail markup replaced."

# 4. Replace modal-new-task and modal-new-project markup
$modalTaskStart = $html.IndexOf('<div id="modal-new-task"')
$modalTaskCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $modalTaskStart)

$modalContactStart = $html.IndexOf('<div id="modal-new-contact"')
$modalContactCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $modalContactStart)

$newModalsMarkup = [System.IO.File]::ReadAllText("scratch/modals_tasks_projects_markup.html", [System.Text.Encoding]::UTF8)
$html = $html.Substring(0, $modalTaskCommentStart) + $newModalsMarkup + "`r`n`r`n" + $html.Substring($modalContactCommentStart)
Write-Output "Step 4: modal-new-task and modal-new-project markup replaced."

# 5. Add Drawer Extra Markup
$jdActionsStart = $html.IndexOf('<!-- Barra de Ações Inferior -->', $html.IndexOf('id="panel-journalist-detail"'))
$jdTasksExtraHtml = @'
        <!-- TAREFAS DE CONTACTO (REGRAS DE LIGAÇÃO CRM) -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Histórico de Contactos (Tarefas Concluídas)</label>
            <span id="jd-completed-contacts-count" class="text-xs font-medium text-[#6C1C37]">0 concluídas</span>
          </div>
          <div id="jd-completed-tasks-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>

          <div class="flex items-center justify-between pt-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Tarefas Pendentes com este Jornalista</label>
            <span id="jd-pending-contacts-count" class="text-xs font-medium text-[#6C1C37]">0 pendentes</span>
          </div>
          <div id="jd-pending-tasks-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>
        </div>
      </div>

'@
$jdCloseBody = $html.LastIndexOf('</div>', $jdActionsStart)
$html = $html.Substring(0, $jdCloseBody) + $jdTasksExtraHtml + $html.Substring($jdActionsStart)

$odActionsStart = $html.IndexOf('<!-- Barra de Ações Inferior -->', $html.IndexOf('id="panel-outlet-detail"'))
$odProjsExtraHtml = @'
        <!-- PROJETOS COM COBERTURA NESTE MEIO (REGRAS DE LIGAÇÃO CRM) -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Projetos com Cobertura Neste Meio</label>
            <span id="od-projects-count" class="text-xs font-medium text-[#6C1C37]">0 projetos</span>
          </div>
          <div id="od-associated-projects-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>
        </div>
      </div>

'@
$odCloseBody = $html.LastIndexOf('</div>', $odActionsStart)
$html = $html.Substring(0, $odCloseBody) + $odProjsExtraHtml + $html.Substring($odActionsStart)
Write-Output "Step 5: Drawers extra markup added."

# 6. Supabase guards for tasks and projects
$oldTasksFetch = @"
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          }
        } catch (e) { }

        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          }
        } catch (e) { }
"@
$newTasksFetch = @"
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks && tasks.length > 0) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          } else if (!localTasks || localTasks.length === 0) {
            localTasks = [...DEFAULT_SAMPLE_TASKS];
          }
        } catch (e) { }

        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects && projects.length > 0) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          } else if (!localProjects || localProjects.length === 0) {
            localProjects = [...DEFAULT_SAMPLE_PROJECTS];
          }
        } catch (e) { }
"@
$html = $html.Replace($oldTasksFetch, $newTasksFetch)

# 7. Update loadFromLocalStorageFallback
$oldFallbackStart = $html.IndexOf("    function loadFromLocalStorageFallback() {")
$oldFallbackEnd = $html.IndexOf("    function syncLocalStorage() {", $oldFallbackStart)

$newFallback = @'
    function loadFromLocalStorageFallback() {
      try {
        localTasks = JSON.parse(localStorage.getItem('rep_tasks') || '[]');
        localProjects = JSON.parse(localStorage.getItem('rep_projects') || '[]');
        localDailyContacts = JSON.parse(localStorage.getItem('rep_contacts') || '[]');
        localJournalists = JSON.parse(localStorage.getItem('rep_journalists') || '[]');
        localOutlets = JSON.parse(localStorage.getItem('rep_outlets') || '[]');
        localClippings = JSON.parse(localStorage.getItem('rep_clippings') || '[]');
      } catch (e) { }

      if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
        localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      }
      if (!localDailyContacts || localDailyContacts.length === 0) {
        localDailyContacts = [...DEFAULT_SAMPLE_CONTACTS];
      }
      if (!localProjects || localProjects.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localProjects = [...DEFAULT_SAMPLE_PROJECTS];
        localStorage.setItem('rep_projects_v5', 'true');
        localStorage.setItem('rep_projects', JSON.stringify(localProjects));
      }
      if (!localClippings || localClippings.length === 0) {
        localClippings = [...DEFAULT_SAMPLE_CLIPPINGS];
      }
      if (!localJournalists || localJournalists.length === 0 || localStorage.getItem('rep_bases_v4') !== 'true') {
        localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
        localStorage.setItem('rep_bases_v4', 'true');
        localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      }
      if (!localOutlets || localOutlets.length === 0 || localStorage.getItem('rep_outlets_v4') !== 'true') {
        localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
        localStorage.setItem('rep_outlets_v4', 'true');
        localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
      }
    }

'@
$html = $html.Substring(0, $oldFallbackStart) + $newFallback + $html.Substring($oldFallbackEnd)

# 8. Update activeProjectId default
$html = $html.Replace("let activeProjectId = 'sample-proj-1';", "let activeProjectId = 'proj-1';")

# 9. Update updateDashboardGreeting
$oldGreetStart = $html.IndexOf("    function updateDashboardGreeting() {")
$oldGreetEnd = $html.IndexOf("    function renderDashboardTodayTasks() {", $oldGreetStart)

$newGreet = @'
    function updateDashboardGreeting() {
      const greetingEl = document.getElementById('dash-greeting');
      const summaryEl = document.getElementById('dash-greeting-summary');
      if (!greetingEl) return;

      const hour = new Date().getHours();
      let salutation = "Bom dia";
      if (hour >= 12 && hour < 20) salutation = "Boa tarde";
      else if (hour >= 20 || hour < 6) salutation = "Boa noite";

      let userName = "Tiago";
      if (currentUser) {
        userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Tiago";
        userName = userName.split(' ')[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
      }

      greetingEl.innerText = `${salutation}, ${userName}`;

      const isTaskDone = (t) => t.status === 'concluida' || t.status === 'completed';
      const todayIso = new Date().toISOString().split('T')[0];
      const overdueCount = localTasks.filter(t => !isTaskDone(t) && isOverdue(t.due_date)).length;
      const todayCount = localTasks.filter(t => !isTaskDone(t) && (isDueToday(t.due_date) || t.due_date === todayIso)).length;

      if (summaryEl) {
        summaryEl.innerHTML = `${todayCount} tarefas para hoje · ${overdueCount > 0 ? '<span class="text-[#A3281E] font-medium">' + overdueCount + ' em atraso</span>' : '<span class="text-[#2F6B3A] font-medium">todas em dia</span>'}`;
      }
    }

'@
$html = $html.Substring(0, $oldGreetStart) + $newGreet + $html.Substring($oldGreetEnd)

# 10. Update renderDashboardAtRiskProjects
$oldRiskStart = $html.IndexOf("    function renderDashboardAtRiskProjects() {")
$oldRiskEnd = $html.IndexOf("    function openContactModalWithClient(clientName) {", $oldRiskStart)

$newRisk = @'
    function renderDashboardAtRiskProjects() {
      const container = document.getElementById('dash-at-risk-projects-container');
      if (!container) return;

      const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      const openProjects = localProjects.filter(p => !isProjDone(p));
      const today = new Date();

      const atRisk = openProjects.filter(p => {
        if (p.status === 'aguarda_aprovacao') return true;
        if (!p.deadline) return false;
        const d = new Date(p.deadline);
        const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      });

      const listToDisplay = atRisk.length > 0 ? atRisk.slice(0, 4) : openProjects.slice(0, 4);

      if (listToDisplay.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            Nenhum projeto em risco. Todos os prazos e aprovações estão em dia.
          </div>
        `;
        return;
      }

      container.innerHTML = listToDisplay.map(proj => {
        const isOverdueProj = proj.deadline && isOverdue(proj.deadline);
        let statusLabel = 'Em curso';
        let statusClass = 'bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]';

        if (isOverdueProj) {
          statusLabel = 'Em atraso';
          statusClass = 'bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]';
        } else if (proj.status === 'aguarda_aprovacao') {
          statusLabel = 'Aguarda cliente';
          statusClass = 'bg-[#FDF0DB] text-[#8A5D18] border-[#E4DDD3]';
        } else if (proj.deadline) {
          statusLabel = 'Prazo próximo (<3 dias)';
          statusClass = 'bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]';
        }

        const clientName = proj.client || proj.client_or_brand || 'Institucional';
        const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
        const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
        const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : (proj.progress || 0);

        return `
          <div onclick="openProjectDetail('${proj.id}')"
            class="p-3.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="min-w-0">
                <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate font-title">
                  ${proj.name}
                </h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[11px] text-[#6B6B6B] truncate">${clientName}</span>
                  <span class="text-[#D1C7BA] text-[10px]">&bull;</span>
                  <span class="text-[10px] font-mono text-[#8A8A8A] truncate">Entrega: ${proj.deadline ? formatDate(proj.deadline) : 'A definir'}</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${statusClass}">
                ${statusLabel}
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-[10px] text-[#6B6B6B]">
                <span>Progresso: ${done}/${projTasks.length} tarefas</span>
                <span class="font-medium text-[#1A1A1A]">${pct}%</span>
              </div>
              <div class="w-full bg-[#E9E5E0] rounded-full h-1 overflow-hidden">
                <div class="h-1 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

'@
$html = $html.Substring(0, $oldRiskStart) + $newRisk + $html.Substring($oldRiskEnd)

# 11. Update updateKpis
$oldKpiStart = $html.IndexOf("    function updateKpis() {")
$oldKpiEnd = $html.IndexOf("    function switchView(", $oldKpiStart)

$newKpis = @'
    function updateKpis() {
      const isTaskDone = (t) => t.status === 'concluida' || t.status === 'completed';
      const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      const todayIso = new Date().toISOString().split('T')[0];

      // 1. Projetos em aberto
      const openProjects = localProjects.filter(p => !isProjDone(p));
      const openProjectsCount = openProjects.length;
      const endingThisWeek = openProjects.filter(p => p.deadline && isDueThisWeek(p.deadline)).length;

      const kpiProjects = document.getElementById('kpi-open-projects');
      if (kpiProjects) kpiProjects.innerText = openProjectsCount;
      const sidebarProjects = document.getElementById('sidebar-projects-count');
      if (sidebarProjects) sidebarProjects.innerText = openProjectsCount;

      // 2. Tarefas para hoje e em atraso
      const todayTasks = localTasks.filter(t => !isTaskDone(t) && (isDueToday(t.due_date) || t.due_date === todayIso));
      const overdueTasks = localTasks.filter(t => !isTaskDone(t) && isOverdue(t.due_date));
      const weekTasks = localTasks.filter(t => !isTaskDone(t) && isDueThisWeek(t.due_date));

      const overdueCount = overdueTasks.length;
      const weekDeliveriesCount = weekTasks.length;

      // 3. A aguardar cliente (tarefas de aprovação pendentes + projetos em aguarda_aprovacao)
      const tasksWaitClient = localTasks.filter(t => !isTaskDone(t) && t.type === 'aprovacao_cliente').length;
      const projsWaitClient = localProjects.filter(p => p.status === 'aguarda_aprovacao').length;
      const awaitingClientTotal = tasksWaitClient + projsWaitClient;

      // 4. Contactos hoje
      const todayContactTasks = localTasks.filter(t => (t.type === 'contacto_jornalista' || t.type === 'contacto com jornalista') && t.due_date === todayIso);
      const todayContactDone = todayContactTasks.filter(t => isTaskDone(t)).length;
      const totalPlannedContacts = Math.max(todayContactTasks.length, 3);

      // Atualização dos 4 cartões do topo do Dashboard
      const cardOpenProj = document.getElementById('dash-card-open-projects');
      if (cardOpenProj) cardOpenProj.innerText = openProjectsCount;
      const cardOpenProjSub = document.getElementById('dash-card-open-projects-sub');
      if (cardOpenProjSub) cardOpenProjSub.innerText = `${endingThisWeek} a terminar esta semana`;

      const cardWeekDeliv = document.getElementById('dash-card-week-deliveries');
      if (cardWeekDeliv) cardWeekDeliv.innerText = weekDeliveriesCount;
      const cardWeekDelivSub = document.getElementById('dash-card-week-deliveries-sub');
      if (cardWeekDelivSub) {
        if (overdueCount > 0) {
          cardWeekDelivSub.className = "text-xs text-[#A3281E] font-medium block";
          cardWeekDelivSub.innerText = `${overdueCount} em atraso`;
        } else {
          cardWeekDelivSub.className = "text-xs text-[#2F6B3A] font-medium block";
          cardWeekDelivSub.innerText = "Em dia";
        }
      }

      const cardWaitClient = document.getElementById('dash-card-waiting-client');
      if (cardWaitClient) cardWaitClient.innerText = awaitingClientTotal;
      const cardWaitClientSub = document.getElementById('dash-card-waiting-client-sub');
      if (cardWaitClientSub) cardWaitClientSub.innerText = "aprovações e feedback pendentes";

      const cardContToday = document.getElementById('dash-card-contacts-today');
      if (cardContToday) cardContToday.innerText = `${todayContactDone} / ${totalPlannedContacts}`;
      const cardContTodaySub = document.getElementById('dash-card-contacts-today-sub');
      if (cardContTodaySub) cardContTodaySub.innerText = "feitos / planeados";

      // Contadores adicionais
      const pendingTasksCount = localTasks.filter(t => !isTaskDone(t)).length;
      const sidebarTasks = document.getElementById('sidebar-tasks-count');
      if (sidebarTasks) sidebarTasks.innerText = pendingTasksCount;
    }

'@
$html = $html.Substring(0, $oldKpiStart) + $newKpis + $html.Substring($oldKpiEnd)

# 12. Hook drawer calls
$html = $html.Replace("document.getElementById('panel-journalist-detail').classList.remove('hidden');", "renderJournalistTasksInDrawer(j);`r`n      document.getElementById('panel-journalist-detail').classList.remove('hidden');")
$html = $html.Replace("document.getElementById('panel-outlet-detail').classList.remove('hidden');", "renderOutletProjectsInDrawer(ocs);`r`n      document.getElementById('panel-outlet-detail').classList.remove('hidden');")

# 13. Remove old renderFullTasks, renderFullProjects, renderProjectDetail, etc.
$startTasksFn = $html.IndexOf("    function renderFullTasks() {")
$contactSectionComment = $html.IndexOf("    // 8. CONTACTOS DO DASHBOARD & PROJETOS", $startTasksFn)
$startOfComment = $html.LastIndexOf("    // ==========================================", $contactSectionComment)
$html = $html.Substring(0, $startTasksFn) + "// [Tasks logic moved to unified block]`r`n`r`n" + $html.Substring($startOfComment)

$startProjFn = $html.IndexOf("    function renderFullProjects() {")
$contactsViewComment = $html.IndexOf("    // 9. VISTA DE CONSULTA DE CONTACTOS", $startProjFn)
$startOfContactsComment = $html.LastIndexOf("    // ==========================================", $contactsViewComment)
$html = $html.Substring(0, $startProjFn) + "// [Projects logic moved to unified block]`r`n`r`n" + $html.Substring($startOfContactsComment)

$startToggle = $html.IndexOf("    async function toggleTaskStatus(id) {")
if ($startToggle -gt 0) {
    $endToggle = $html.IndexOf("    async function deleteTask(id) {", $startToggle)
    $html = $html.Substring(0, $startToggle) + "// [toggleTaskStatus moved to unified block]`r`n`r`n" + $html.Substring($endToggle)
}

$startNewTask = $html.IndexOf("    async function handleNewTaskSubmit(e) {")
if ($startNewTask -gt 0) {
    $startNewContact = $html.IndexOf("    async function handleNewContactSubmit(e) {", $startNewTask)
    $html = $html.Substring(0, $startNewTask) + "// [handleNewTaskSubmit and handleNewProjectSubmit moved to unified block]`r`n`r`n" + $html.Substring($startNewContact)
}

$startOpenTask = $html.IndexOf("    function openTaskModal() {")
if ($startOpenTask -gt 0) {
    $startOpenContact = $html.IndexOf("    function openContactModal() {", $startOpenTask)
    $html = $html.Substring(0, $startOpenTask) + "// [openTaskModal and openProjectModal moved to unified block]`r`n`r`n" + $html.Substring($startOpenContact)
}

# 14. Append unified logic blocks before closing </script>
$tasksProjectsLogic = [System.IO.File]::ReadAllText("scratch/tasks_projects_logic.js", [System.Text.Encoding]::UTF8)
$drawersExtraLogic = [System.IO.File]::ReadAllText("scratch/drawers_extra_logic.js", [System.Text.Encoding]::UTF8)
$openProjDetailSnippet = [System.IO.File]::ReadAllText("scratch/open_proj_detail_snippet.js", [System.Text.Encoding]::UTF8)

$scriptEnd = $html.LastIndexOf("  </script>")
if ($scriptEnd -lt 0) { throw "Could not find </script>" }

$unifiedBlock = @"

$tasksProjectsLogic

$openProjDetailSnippet

$drawersExtraLogic

"@

$html = $html.Substring(0, $scriptEnd) + $unifiedBlock + $html.Substring($scriptEnd)

# 15. Save to outputHtmlPath
[System.IO.File]::WriteAllText($outputHtmlPath, $html, [System.Text.Encoding]::UTF8)
Write-Output "Master build complete! Output written to $outputHtmlPath. Length: $($html.Length)"
