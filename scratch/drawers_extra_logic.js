    // ========================================================
    // INTEGRAÇÃO DE TAREFAS & PROJETOS NAS GAVETAS (REGRAS 2 & 3)
    // ========================================================

    function renderJournalistTasksInDrawer(j) {
      const completedList = document.getElementById('jd-completed-tasks-list');
      const completedCountEl = document.getElementById('jd-completed-contacts-count');
      const pendingList = document.getElementById('jd-pending-tasks-list');
      const pendingCountEl = document.getElementById('jd-pending-contacts-count');

      if (!completedList || !pendingList) return;

      const jTasks = localTasks.filter(t => t.journalist_id === j.id || t.journalist_name === j.name);
      const completedTasks = jTasks.filter(t => t.status === 'concluida' || t.status === 'completed');
      const pendingTasks = jTasks.filter(t => t.status !== 'concluida' && t.status !== 'completed');

      if (completedCountEl) completedCountEl.innerText = `${completedTasks.length} concluídas`;
      if (pendingCountEl) pendingCountEl.innerText = `${pendingTasks.length} pendentes`;

      // 1. Tarefas Concluídas (Histórico)
      if (completedTasks.length === 0) {
        completedList.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Nenhum contacto concluído registado no sistema.</span>';
      } else {
        completedList.innerHTML = completedTasks.map(t => `
          <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-medium text-[#1A1A1A]">${t.title}</span>
              <span class="font-mono text-[11px] text-[#6B6B6B]">${t.due_date || (t.completed_at ? t.completed_at.split('T')[0] : '—')}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#6B6B6B]">
              <span>Projeto: <strong class="text-[#1A1A1A] font-normal">${t.project_name || 'Geral'}</strong></span>
              <span>Resp: ${t.responsible || 'Leonor Rodrigues'}</span>
            </div>
            ${t.notes ? `<p class="text-[11px] text-[#6B6B6B] italic pt-0.5 border-t border-[#E4DDD3]/60">${t.notes}</p>` : ''}
          </div>
        `).join('');
      }

      // 2. Tarefas Pendentes
      if (pendingTasks.length === 0) {
        pendingList.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Não existem contactos ou tarefas pendentes com este jornalista.</span>';
      } else {
        pendingList.innerHTML = pendingTasks.map(t => {
          const isTaskOverdue = t.due_date && isOverdue(t.due_date);
          return `
            <div class="p-3 bg-white rounded-xl border border-[#E4DDD3] space-y-1.5 text-xs shadow-xs">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium text-[#1A1A1A]">${t.title}</span>
                ${isTaskOverdue 
                  ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span>`
                  : `<span class="font-mono text-[11px] text-[#6B6B6B]">${t.due_date || 'Hoje'}</span>`
                }
              </div>
              <div class="flex items-center justify-between text-[11px] text-[#6B6B6B]">
                <span>Projeto: ${t.project_name || 'Geral'}</span>
                <button onclick="toggleTaskStatus('${t.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline flex items-center gap-1">
                  <span>Concluir contacto &check;</span>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    function renderOutletProjectsInDrawer(ocs) {
      const container = document.getElementById('od-associated-projects-list');
      const countEl = document.getElementById('od-projects-count');
      if (!container) return;

      // Obter ids de jornalistas deste órgão
      const outletJourIds = localJournalists.filter(j => 
        (j.outlet_ids && j.outlet_ids.includes(ocs.id)) || 
        j.outlet_name === ocs.name || 
        (j.outlet_names && j.outlet_names.includes(ocs.name))
      ).map(j => j.id);

      const associatedProjs = localProjects.filter(p => {
        if (p.target_outlets && p.target_outlets.includes(ocs.name)) return true;
        if (p.target_journalist_ids && p.target_journalist_ids.some(jid => outletJourIds.includes(jid))) return true;
        return false;
      });

      if (countEl) countEl.innerText = `${associatedProjs.length} projetos`;

      if (associatedProjs.length === 0) {
        container.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Nenhum projeto ativo com cobertura prevista neste meio.</span>';
      } else {
        container.innerHTML = associatedProjs.map(p => `
          <div onclick="closeOutletDetailDrawer(); openProjectDetail('${p.id}');"
            class="p-3 bg-white rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/50 hover:bg-[#FBF9F6] transition-all cursor-pointer flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="font-semibold text-xs text-[#1A1A1A] block">${p.name}</span>
              <span class="text-[11px] text-[#6B6B6B]">${p.client || p.client_or_brand} · Prazo: ${p.deadline || '—'}</span>
            </div>
            <div class="flex items-center gap-2">
              ${getProjectStatusBadge(p.status)}
              <span class="text-xs text-[#6C1C37]">&rarr;</span>
            </div>
          </div>
        `).join('');
      }
    }
