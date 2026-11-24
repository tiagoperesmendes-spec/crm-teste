$filePath = "scratch/test_updated_dashboard.html"
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$oldRiskStart = $text.IndexOf("    function renderDashboardAtRiskProjects() {")
$oldRiskEnd = $text.IndexOf("    function openContactModalWithClient(clientName) {", $oldRiskStart)

$newRisk = @'
    function renderDashboardAtRiskProjects() {
      const container = document.getElementById('dash-at-risk-projects-container');
      if (!container) return;

      const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      const openProjects = localProjects.filter(p => !isProjDone(p));
      const today = new Date();

      // Encontrar projetos com prazo ultrapassado, prazo <= 3 dias ou estado aguarda_aprovacao
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

$text = $text.Substring(0, $oldRiskStart) + $newRisk + $text.Substring($oldRiskEnd)
[System.IO.File]::WriteAllText($filePath, $text, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated renderDashboardAtRiskProjects with literal here-string!"
