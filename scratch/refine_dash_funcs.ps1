$filePath = "scratch/test_updated_dashboard.html"
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Replace updateDashboardGreeting
$oldGreetStart = $text.IndexOf("    function updateDashboardGreeting() {")
$oldGreetEnd = $text.IndexOf("    function renderDashboardTodayTasks() {", $oldGreetStart)

$newGreet = @"
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

"@

$text = $text.Substring(0, $oldGreetStart) + $newGreet + $text.Substring($oldGreetEnd)

# Replace updateKpis
$oldKpiStart = $text.IndexOf("    function updateKpis() {")
$oldKpiEnd = $text.IndexOf("    function switchView(", $oldKpiStart)

$newKpis = @"
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

"@

$text = $text.Substring(0, $oldKpiStart) + $newKpis + $text.Substring($oldKpiEnd)

[System.IO.File]::WriteAllText($filePath, $text, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated greeting and kpis! New length: $($text.Length)"
