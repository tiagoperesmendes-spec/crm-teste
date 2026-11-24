    // ========================================================
    // GESTÃO COMPLETA DE TAREFAS (SUBMISSÃO, ESTADO, MENUS, RENDERIZAÇÃO)
    // ========================================================

    async function handleNewTaskSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();

      const titleInput = document.getElementById('task-title');
      const title = titleInput ? titleInput.value.trim() : '';
      if (!title) {
        showToast('Por favor preenche o título da tarefa.');
        return;
      }

      const type = document.getElementById('task-type-select')?.value || 'contacto_jornalista';
      const due_date = document.getElementById('task-duedate')?.value || new Date().toISOString().split('T')[0];
      const due_time = document.getElementById('task-duetime')?.value || '18:00';
      const responsible = document.getElementById('task-responsible-select')?.value || 'Tiago Mendes';
      const priority = document.getElementById('task-priority-select')?.value || 'media';
      const project_id = document.getElementById('task-project-select')?.value || '';
      const status = document.getElementById('task-status-select')?.value || 'por_fazer';
      const notes = document.getElementById('task-notes')?.value.trim() || '';

      let project_name = 'Geral';
      let client = 'Geral';
      if (project_id) {
        const pObj = (localProjects || []).find(p => p.id === project_id);
        if (pObj) {
          project_name = pObj.name;
          client = pObj.client || pObj.client_or_brand || 'Geral';
        }
      }

      let journalist_id = '';
      let journalist_name = '';
      if (type === 'contacto_jornalista') {
        const jSelect = document.getElementById('task-journalist-select');
        journalist_id = jSelect ? jSelect.value : '';
        if (journalist_id) {
          const jObj = (localJournalists || []).find(j => j.id === journalist_id);
          if (jObj) journalist_name = jObj.name;
        }
      }

      if (editingTaskId) {
        // Atualizar tarefa existente
        const task = localTasks.find(t => t.id === editingTaskId);
        if (task) {
          task.title = title;
          task.type = type;
          task.due_date = due_date;
          task.due_time = due_time;
          task.responsible = responsible;
          task.assignee = responsible;
          task.assignee_name = responsible;
          task.priority = priority;
          task.project_id = project_id;
          task.project_name = project_name;
          task.client = client;
          task.client_or_brand = client;
          task.journalist_id = journalist_id || null;
          task.journalist_name = journalist_name || null;
          task.status = status;
          task.notes = notes;

          if (status === 'concluida') {
            task.completed_at = task.completed_at || new Date().toISOString();
            if (type === 'contacto_jornalista' && journalist_id) {
              const jour = (localJournalists || []).find(j => j.id === journalist_id);
              if (jour) {
                jour.last_contact_date = new Date().toISOString().split('T')[0];
                jour.updated_at = new Date().toISOString();
              }
            }
          }

          // Recalcular progresso do projeto
          if (project_id) {
            const pObj = (localProjects || []).find(p => p.id === project_id);
            if (pObj) {
              const projTasks = localTasks.filter(t => t.project_id === project_id);
              const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
              pObj.progress = Math.round((done / projTasks.length) * 100);
            }
          }

          if (supabaseClient) {
            try {
              await supabaseClient.from('tasks').update({
                title, type, due_date, due_time, responsible, priority,
                project_id, project_name, client, journalist_id, journalist_name,
                status, notes
              }).eq('id', task.id);
            } catch (err) { }
          }
        }
        editingTaskId = null;
        closeTaskModal();
        syncLocalStorage();
        renderAll();
        showToast('Tarefa atualizada com sucesso.');
      } else {
        // Criar nova tarefa
        const newTask = {
          id: 'task-' + Date.now(),
          title,
          project_id,
          project_name,
          client,
          client_or_brand: client,
          type,
          journalist_id: journalist_id || null,
          journalist_name: journalist_name || null,
          responsible,
          assignee: responsible,
          assignee_name: responsible,
          priority,
          due_date,
          due_time,
          status,
          notes,
          created_at: new Date().toISOString()
        };

        if (status === 'concluida') {
          newTask.completed_at = new Date().toISOString();
          if (type === 'contacto_jornalista' && journalist_id) {
            const jour = (localJournalists || []).find(j => j.id === journalist_id);
            if (jour) {
              jour.last_contact_date = new Date().toISOString().split('T')[0];
              jour.updated_at = new Date().toISOString();
            }
          }
        }

        if (supabaseClient) {
          try {
            const { data, error } = await supabaseClient.from('tasks').insert([newTask]).select();
            if (!error && data && data[0]) newTask.id = data[0].id;
          } catch (err) { }
        }

        localTasks.unshift(newTask);

        // Recalcular progresso do projeto
        if (project_id) {
          const pObj = (localProjects || []).find(p => p.id === project_id);
          if (pObj) {
            const projTasks = localTasks.filter(t => t.project_id === project_id);
            const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
            pObj.progress = Math.round((done / projTasks.length) * 100);
          }
        }

        syncLocalStorage();
        closeTaskModal();

        // Repor filtros de pesquisa e mostrar aba Todas para que a nova tarefa surja no topo
        currentTaskTab = 'all';
        const q = document.getElementById('tasks-search-input');
        if (q) q.value = '';
        const t = document.getElementById('tasks-filter-type');
        if (t) t.value = 'all';
        const p = document.getElementById('tasks-filter-priority');
        if (p) p.value = 'all';
        const r = document.getElementById('tasks-filter-responsible');
        if (r) r.value = 'all';

        setTasksStatusTab('all');
        renderAll();
        showToast('Tarefa criada com sucesso.');
      }
    }

    async function toggleTaskStatus(id) {
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const wasCompleted = task.status === 'concluida' || task.status === 'completed';
      const newStatus = wasCompleted ? 'por_fazer' : 'concluida';
      task.status = newStatus;
      
      const todayStr = new Date().toISOString().split('T')[0];

      if (!wasCompleted) {
        task.completed_at = new Date().toISOString();

        // Regra 1: Concluir contacto com jornalista atualiza último contacto
        if (task.type === 'contacto_jornalista' || task.type === 'contacto com jornalista') {
          let jour = null;
          if (task.journalist_id) {
            jour = localJournalists.find(j => j.id === task.journalist_id);
          }
          if (!jour && task.journalist_name) {
            jour = localJournalists.find(j => j.name === task.journalist_name);
          }
          if (jour) {
            jour.last_contact_date = todayStr;
            jour.updated_at = new Date().toISOString();
          }
        }
      } else {
        task.completed_at = null;
      }

      // Regra 4: Recalcular progresso do projeto
      if (task.project_id || task.project_name) {
        const proj = localProjects.find(p => (task.project_id && p.id === task.project_id) || (task.project_name && p.name === task.project_name));
        if (proj) {
          const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
          const doneCount = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
          proj.progress = projTasks.length > 0 ? Math.round((doneCount / projTasks.length) * 100) : 0;
          proj.updated_at = new Date().toISOString();
        }
      }

      if (supabaseClient) {
        try {
          await supabaseClient.from('tasks').update({ status: newStatus, completed_at: task.completed_at }).eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast(newStatus === 'concluida' ? 'Tarefa concluída com sucesso.' : 'Tarefa reaberta.');
    }

    function closeAllTaskMenus() {
      document.querySelectorAll('.task-row-menu-popover').forEach(el => el.classList.add('hidden'));
    }

    function toggleTaskRowMenu(id, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const menu = document.getElementById(`task-menu-${id}`);
      const isHidden = menu ? menu.classList.contains('hidden') : true;
      closeAllTaskMenus();
      if (menu && isHidden) {
        const btn = e ? e.currentTarget : null;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          menu.style.top = `${rect.bottom + 4}px`;
          menu.style.left = `${Math.min(rect.right - 176, window.innerWidth - 186)}px`;
        }
        menu.classList.remove('hidden');
      }
    }

    function renderFullTasks() {
      if (!localTasks || localTasks.length === 0) {
        localTasks = (typeof DEFAULT_SAMPLE_TASKS !== 'undefined') ? [...DEFAULT_SAMPLE_TASKS] : [];
        try { localStorage.setItem('rep_tasks', JSON.stringify(localTasks)); } catch (e) { }
      }
      const wrapper = document.getElementById('tasks-content-wrapper');
      if (!wrapper) return;

      const isTaskDone = (t) => t.status === 'concluida' || t.status === 'completed';
      const todayIso = new Date().toISOString().split('T')[0];

      // 1. Contagens para separadores e cabeçalho
      const totalCount = localTasks.length;
      const todayCount = localTasks.filter(t => !isTaskDone(t) && (isDueToday(t.due_date) || t.due_date === todayIso)).length;
      const weekCount = localTasks.filter(t => !isTaskDone(t) && isDueThisWeek(t.due_date)).length;
      const overdueCount = localTasks.filter(t => !isTaskDone(t) && isOverdue(t.due_date)).length;
      const myCount = localTasks.filter(t => {
        const resp = (t.responsible || t.assignee || t.assignee_name || '').toLowerCase();
        const cur = (currentUser?.name || currentUser?.user_metadata?.full_name || 'Tiago').toLowerCase();
        return resp.includes('tiago') || resp.includes(cur.split(' ')[0]);
      }).length;

      // Atualizar badges dos separadores
      const cAll = document.getElementById('task-tab-count-all');
      if (cAll) cAll.innerText = totalCount;
      const cToday = document.getElementById('task-tab-count-today');
      if (cToday) cToday.innerText = todayCount;
      const cWeek = document.getElementById('task-tab-count-week');
      if (cWeek) cWeek.innerText = weekCount;
      const cOverdue = document.getElementById('task-tab-count-overdue');
      if (cOverdue) cOverdue.innerText = overdueCount;
      const cMy = document.getElementById('task-tab-count-my');
      if (cMy) cMy.innerText = myCount;

      // Resumo calculado no cabeçalho
      const summaryText = document.getElementById('tasks-summary-text');
      if (summaryText) {
        summaryText.innerText = `${totalCount} tarefas · ${overdueCount} em atraso · ${todayCount} para hoje`;
      }

      // 2. Filtragem
      let filtered = [...localTasks];

      // Filtro por separador
      if (currentTaskTab === 'today') {
        filtered = filtered.filter(t => isDueToday(t.due_date) || t.due_date === todayIso);
      } else if (currentTaskTab === 'week') {
        filtered = filtered.filter(t => isDueThisWeek(t.due_date));
      } else if (currentTaskTab === 'overdue') {
        filtered = filtered.filter(t => !isTaskDone(t) && isOverdue(t.due_date));
      } else if (currentTaskTab === 'my') {
        filtered = filtered.filter(t => {
          const resp = (t.responsible || t.assignee || t.assignee_name || '').toLowerCase();
          const cur = (currentUser?.name || currentUser?.user_metadata?.full_name || 'Tiago').toLowerCase();
          return resp.includes('tiago') || resp.includes(cur.split(' ')[0]);
        });
      }

      // Filtro por pesquisa
      const searchInput = document.getElementById('tasks-search-input');
      const searchQuery = (searchInput ? searchInput.value : '').trim().toLowerCase();
      if (searchQuery) {
        filtered = filtered.filter(t => {
          return (t.title && t.title.toLowerCase().includes(searchQuery)) ||
            (t.project_name && t.project_name.toLowerCase().includes(searchQuery)) ||
            (t.client && t.client.toLowerCase().includes(searchQuery)) ||
            (t.journalist_name && t.journalist_name.toLowerCase().includes(searchQuery)) ||
            (t.notes && t.notes.toLowerCase().includes(searchQuery));
        });
      }

      // Filtro por tipo
      const typeFilter = document.getElementById('tasks-filter-type')?.value;
      if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
      }

      // Filtro por prioridade
      const prioFilter = document.getElementById('tasks-filter-priority')?.value;
      if (prioFilter && prioFilter !== 'all') {
        filtered = filtered.filter(t => (t.priority || '').toLowerCase() === prioFilter.toLowerCase());
      }

      // Filtro por responsável
      const respFilter = document.getElementById('tasks-filter-responsible')?.value;
      if (respFilter && respFilter !== 'all') {
        filtered = filtered.filter(t => {
          const resp = t.responsible || t.assignee || t.assignee_name || '';
          return resp === respFilter;
        });
      }

      // 3. Estados vazios
      const footerEl = document.getElementById('tasks-table-footer');
      if (filtered.length === 0) {
        if (localTasks.length === 0) {
          wrapper.innerHTML = `
            <div class="bg-white rounded-2xl border border-[#E4DDD3] p-12 text-center">
              <p class="font-bold text-base text-[#1A1A1A] mb-1 font-title">Ainda não tens tarefas</p>
              <p class="text-xs text-[#8A8A8A] mb-4">Começa por criar a primeira entrega operacional ou contacto com jornalista.</p>
              <button onclick="openTaskModal()" class="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#6C1C37] text-white hover:bg-[#56162C] transition-all shadow-xs cursor-pointer">
                + Criar a primeira tarefa
              </button>
            </div>
          `;
        } else {
          wrapper.innerHTML = `
            <div class="bg-white rounded-2xl border border-[#E4DDD3] p-12 text-center">
              <p class="font-bold text-base text-[#1A1A1A] mb-1 font-title">Nenhuma tarefa com estes filtros</p>
              <p class="text-xs text-[#8A8A8A] mb-3">Tenta ajustar os filtros ou a barra de pesquisa.</p>
              <button onclick="clearTasksFilters()" class="text-xs font-semibold text-[#6C1C37] hover:underline cursor-pointer">
                Limpar filtros
              </button>
            </div>
          `;
        }
        if (footerEl) footerEl.innerText = `A mostrar 0 de ${localTasks.length} tarefas`;
        return;
      }

      if (footerEl) footerEl.innerText = `A mostrar ${filtered.length} de ${localTasks.length} tarefas`;

      // 4. Função auxiliar para renderizar uma linha de tarefa
      function renderTaskTableRow(t) {
        const isDone = isTaskDone(t);
        const dueInfo = getTaskDueInfo(t.due_date, isDone);
        const isTaskOverdue = dueInfo.isOverdue && !isDone;

        const projName = t.project_name || 'Geral';
        const clientName = t.client || t.client_or_brand || (t.project_id ? (localProjects.find(p => p.id === t.project_id)?.client || '—') : '—');
        const respName = t.responsible || t.assignee || t.assignee_name || 'Leonor Rodrigues';
        const avatar = getUserAvatar(respName);

        // Subtítulo da tarefa: Projeto · Cliente ou Jornalista
        let detailsHtml = '';
        if (t.project_id) {
          detailsHtml = `<button type="button" onclick="event.stopPropagation(); openProjectDetail('${t.project_id}')" class="text-xs text-[#8A8A8A] hover:text-[#6C1C37] hover:underline">${projName}</button><span class="text-[#8A8A8A]"> · ${clientName}</span>`;
        } else if (t.journalist_name || t.journalist_id) {
          const jId = t.journalist_id || (localJournalists.find(j => j.name === t.journalist_name)?.id);
          const jName = t.journalist_name || 'Jornalista';
          if (jId) {
            detailsHtml = `<button type="button" onclick="event.stopPropagation(); openJournalistDetailDrawer('${jId}')" class="text-xs text-[#6C1C37] hover:underline font-medium">${jName}</button>`;
          } else {
            detailsHtml = `<span class="text-xs text-[#8A8A8A]">${jName}</span>`;
          }
        } else {
          detailsHtml = `<span class="text-xs text-[#8A8A8A]">${projName}</span>`;
        }

        const rowBgClass = isTaskOverdue
          ? 'bg-[#FDF6F5] hover:bg-[#FAEFEB]'
          : (isDone ? 'bg-[#FCFCFC] opacity-70 hover:opacity-100 hover:bg-[#FBF9F6]' : 'bg-white hover:bg-[#FBF9F6]');

        return `
          <tr class="${rowBgClass} transition-colors cursor-pointer group" onclick="openEditTaskModal('${t.id}')">
            <!-- 1. Checkbox Conclusão -->
            <td class="w-10 text-center py-3.5 px-3" onclick="event.stopPropagation()">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            </td>

            <!-- 2. Tarefa (Título + Detalhes) -->
            <td class="py-3.5 px-4 min-w-[200px]">
              <div class="font-bold text-xs ${isDone ? 'line-through text-[#8A8A8A]' : 'text-[#1A1A1A] group-hover:text-[#6C1C37]'} transition-colors">${t.title}</div>
              <div class="mt-0.5">${detailsHtml}</div>
            </td>

            <!-- 3. Tipo -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              ${getTaskTypeBadge(t.type)}
            </td>

            <!-- 4. Responsável -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style="background-color: ${avatar.color};">
                  ${avatar.initials}
                </div>
                <span class="text-xs text-[#1A1A1A]">${avatar.shortName || respName}</span>
              </div>
            </td>

            <!-- 5. Prazo -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="font-bold text-xs text-[#1A1A1A]">${dueInfo.formatted}</div>
              ${dueInfo.relative ? `<div class="text-[11px] ${dueInfo.textClass}">${dueInfo.relative}</div>` : ''}
            </td>

            <!-- 6. Prioridade -->
            <td class="py-3.5 px-4 whitespace-nowrap">
              ${getProjectPriorityBadge(t.priority)}
            </td>

            <!-- Menu ⋯ -->
            <td class="py-3.5 px-3 text-right whitespace-nowrap" onclick="event.stopPropagation()">
              <div class="relative inline-block text-left">
                <button type="button" onclick="toggleTaskRowMenu('${t.id}', event)"
                  class="task-row-menu-btn text-[#8A8A8A] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F0ECE7] transition-colors cursor-pointer"
                  title="Mais opções">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>
                <div id="task-menu-${t.id}" class="task-row-menu-popover hidden fixed z-50 w-44 bg-white border border-[#E4DDD3] rounded-xl shadow-lg py-1 text-xs">
                  <button type="button" onclick="closeAllTaskMenus(); toggleTaskStatus('${t.id}')"
                    class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    ${isDone ? 'Reabrir tarefa' : 'Concluir tarefa'}
                  </button>
                  <button type="button" onclick="closeAllTaskMenus(); openEditTaskModal('${t.id}')"
                    class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    Editar
                  </button>
                  ${currentUserPermissions()?.canDeleteRecords ? `
                    <div class="border-t border-[#E4DDD3] my-1"></div>
                    <button type="button" onclick="closeAllTaskMenus(); deleteTask('${t.id}')"
                      class="w-full text-left px-3.5 py-2 hover:bg-[#FBEAE8] text-[#C53030] flex items-center gap-2">
                      Eliminar
                    </button>
                  ` : ''}
                </div>
              </div>
            </td>
          </tr>
        `;
      }

      // Ordenação: não concluídas em atraso primeiro, depois prazo mais próximo, concluídas no fim
      filtered.sort((a, b) => {
        const isADone = isTaskDone(a);
        const isBDone = isTaskDone(b);
        if (isADone && !isBDone) return 1;
        if (!isADone && isBDone) return -1;

        const isAOverdue = isOverdue(a.due_date) && !isADone;
        const isBOverdue = isOverdue(b.due_date) && !isBDone;
        if (isAOverdue && !isBOverdue) return -1;
        if (!isAOverdue && isBOverdue) return 1;

        return (a.due_date || '').localeCompare(b.due_date || '');
      });

      // 1. MODO: SEM AGRUPAMENTO
      if (currentTaskGrouping === 'none') {
        wrapper.innerHTML = `
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#E4DDD3] bg-[#FAF8F5] text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
                    <th class="w-10 text-center py-3 px-3">Estado</th>
                    <th class="py-3 px-4">Tarefa</th>
                    <th class="py-3 px-4">Tipo</th>
                    <th class="py-3 px-4">Responsável</th>
                    <th class="py-3 px-4">Prazo</th>
                    <th class="py-3 px-4">Prioridade</th>
                    <th class="py-3 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E4DDD3]/60 text-xs">
                  ${filtered.map(renderTaskTableRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      // 2. MODO: AGRUPAR POR PROJETO
      if (currentTaskGrouping === 'project') {
        const groups = {};
        filtered.forEach(t => {
          const pName = t.project_name || 'Geral / Sem Projeto';
          if (!groups[pName]) groups[pName] = [];
          groups[pName].push(t);
        });

        wrapper.innerHTML = Object.keys(groups).map(pName => {
          const groupTasks = groups[pName];
          const pObj = localProjects.find(p => p.name === pName);
          const done = groupTasks.filter(isTaskDone).length;

          return `
            <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-0">
              <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-sm font-bold text-[#1A1A1A] font-title">${pName}</h3>
                  ${pObj?.client ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EDE6DE] text-[#5C554E]">${pObj.client}</span>` : ''}
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-[#8A8A8A]">${done} de ${groupTasks.length} concluídas</span>
                  ${pObj ? `<button onclick="openProjectDetail('${pObj.id}')" class="text-xs text-[#6C1C37] font-semibold hover:underline">Abrir projeto &rarr;</button>` : ''}
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-[#E4DDD3] bg-[#FAF8F5] text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
                      <th class="w-10 text-center py-3 px-3">Estado</th>
                      <th class="py-3 px-4">Tarefa</th>
                      <th class="py-3 px-4">Tipo</th>
                      <th class="py-3 px-4">Responsável</th>
                      <th class="py-3 px-4">Prazo</th>
                      <th class="py-3 px-4">Prioridade</th>
                      <th class="py-3 px-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#E4DDD3]/60 text-xs">
                    ${groupTasks.map(renderTaskTableRow).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('');
        return;
      }

      // 3. MODO: AGRUPAR POR PRAZO
      if (currentTaskGrouping === 'due_date') {
        const overdue = filtered.filter(t => isOverdue(t.due_date) && !isTaskDone(t));
        const today = filtered.filter(t => (isDueToday(t.due_date) || t.due_date === todayIso) && !isOverdue(t.due_date));
        const thisWeek = filtered.filter(t => isDueThisWeek(t.due_date) && t.due_date !== todayIso && !isOverdue(t.due_date));
        const future = filtered.filter(t => !isOverdue(t.due_date) && t.due_date !== todayIso && !isDueThisWeek(t.due_date));

        const sections = [
          { title: 'Em Atraso', tasks: overdue, color: 'text-[#A3281E]', badgeBg: 'bg-[#FBEAE8] text-[#A3281E]' },
          { title: 'Para Hoje', tasks: today, color: 'text-[#6C1C37]', badgeBg: 'bg-[#F4EAE6] text-[#6C1C37]' },
          { title: 'Esta Semana', tasks: thisWeek, color: 'text-[#1A1A1A]', badgeBg: 'bg-[#F6F2EC] text-[#1A1A1A]' },
          { title: 'Próximas Semanas & Sem Prazo', tasks: future, color: 'text-[#6B6B6B]', badgeBg: 'bg-[#F6F2EC] text-[#6B6B6B]' }
        ];

        wrapper.innerHTML = sections.filter(s => s.tasks.length > 0).map(s => `
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-0">
            <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold ${s.color} font-title">${s.title}</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${s.badgeBg}">${s.tasks.length}</span>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#E4DDD3] bg-[#FAF8F5] text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
                    <th class="w-10 text-center py-3 px-3">Estado</th>
                    <th class="py-3 px-4">Tarefa</th>
                    <th class="py-3 px-4">Tipo</th>
                    <th class="py-3 px-4">Responsável</th>
                    <th class="py-3 px-4">Prazo</th>
                    <th class="py-3 px-4">Prioridade</th>
                    <th class="py-3 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E4DDD3]/60 text-xs">
                  ${s.tasks.map(renderTaskTableRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('');
      }
    }
