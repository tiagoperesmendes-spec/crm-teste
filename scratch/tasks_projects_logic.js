    // ========================================================
    // MÓDULO 1: PROJETOS & MÓDULO 2: TAREFAS (LÓGICA CRM)
    // ========================================================

    let currentProjectsViewMode = 'list'; // 'list' | 'kanban'
    let currentProjStatusFilter = 'all';
    let currentProjClientFilter = 'all';
    let currentProjRespFilter = 'all';
    let currentProjPriorityFilter = 'all';

    currentTaskTab = 'all'; // 'all' | 'today' | 'week' | 'overdue' | 'my'
    let currentTaskGrouping = 'none'; // 'none' | 'project' | 'due_date'

    let activeProjectDetailTab = 'overview'; // 'overview' | 'tasks' | 'journalists'

    // Formatação de Badges
    function getProjectStatusBadge(status) {
      const map = {
        'em_preparacao': { bg: '#EBF1F5', text: '#2F4A63', label: 'Em preparação' },
        'em_curso': { bg: '#DDEBDD', text: '#2F6B3A', label: 'Em curso' },
        'in_progress': { bg: '#DDEBDD', text: '#2F6B3A', label: 'Em curso' },
        'aguarda_aprovacao': { bg: '#FDF0DB', text: '#8A5D18', label: 'A aguardar aprovação' },
        'concluido': { bg: '#E9E5E0', text: '#5C554E', label: 'Concluído' },
        'completed': { bg: '#E9E5E0', text: '#5C554E', label: 'Concluído' },
        'em_pausa': { bg: '#F6F2EC', text: '#6B6B6B', label: 'Em pausa' },
        'on_hold': { bg: '#F6F2EC', text: '#6B6B6B', label: 'Em pausa' }
      };
      const conf = map[status] || { bg: '#F6F2EC', text: '#6B6B6B', label: status || '—' };
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium" style="background-color: ${conf.bg}; color: ${conf.text};">${conf.label}</span>`;
    }

    function getProjectTypeBadge(type) {
      const map = {
        'lancamento': 'Lançamento',
        'evento': 'Evento',
        'comunicado': 'Comunicado',
        'entrevista': 'Entrevista',
        'campanha': 'Campanha',
        'crise': 'Gestão de Crise'
      };
      const label = map[type] || type || 'Geral';
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">${label}</span>`;
    }

    function getProjectPriorityBadge(priority) {
      if (priority === 'alta') {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Alta</span>`;
      }
      if (priority === 'baixa') {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F6F2EC] text-[#6B6B6B]">Baixa</span>`;
      }
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDF0DB] text-[#8A5D18]">Média</span>`;
    }

    function getTaskTypeBadge(type) {
      const map = {
        'contacto_jornalista': { label: 'Contacto jornalista', bg: '#F4EAE6', text: '#6C1C37' },
        'contacto com jornalista': { label: 'Contacto jornalista', bg: '#F4EAE6', text: '#6C1C37' },
        'redacao': { label: 'Redação', bg: '#EBF1F5', text: '#2F4A63' },
        'reuniao': { label: 'Reunião', bg: '#F6F2EC', text: '#1A1A1A' },
        'aprovacao_cliente': { label: 'Aprovação cliente', bg: '#FDF0DB', text: '#8A5D18' },
        'outra': { label: 'Outra', bg: '#F6F2EC', text: '#6B6B6B' }
      };
      const conf = map[type] || { label: type || 'Geral', bg: '#F6F2EC', text: '#6B6B6B' };
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: ${conf.bg}; color: ${conf.text};">${conf.label}</span>`;
    }

    // Alternar modo de visualização de projetos
    function setProjectsViewMode(mode) {
      currentProjectsViewMode = mode;
      const btnList = document.getElementById('btn-proj-view-list');
      const btnKanban = document.getElementById('btn-proj-view-kanban');
      const listContainer = document.getElementById('projects-list-container');
      const kanbanContainer = document.getElementById('projects-kanban-container');

      if (mode === 'list') {
        btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.remove('hidden');
        kanbanContainer?.classList.add('hidden');
      } else {
        btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.add('hidden');
        kanbanContainer?.classList.remove('hidden');
      }
      renderFullProjects();
    }

    function filterProjectsByState(val) {
      currentProjStatusFilter = val;
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

    // ========================================================
    // RENDERIZAÇÃO COMPLETA DE PROJETOS (LISTA & KANBAN)
    // ========================================================
    function renderFullProjects() {
      // Atualizar badge total
      const totalBadge = document.getElementById('projects-total-badge');
      if (totalBadge) totalBadge.innerText = `${localProjects.length} projetos registados`;

      // Atualizar dropdown de clientes
      const clientSelect = document.getElementById('filter-proj-client');
      if (clientSelect) {
        const clients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = `<option value="all">Todos os Clientes (${clients.length})</option>` +
          clients.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
      }

      // Filtragem
      let filtered = [...localProjects];
      if (currentProjStatusFilter !== 'all') {
        filtered = filtered.filter(p => {
          if (currentProjStatusFilter === 'em_curso') return p.status === 'em_curso' || p.status === 'in_progress';
          if (currentProjStatusFilter === 'concluido') return p.status === 'concluido' || p.status === 'completed';
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

      // 1. RENDERIZAR LISTA
      const tbody = document.getElementById('projects-table-body');
      if (tbody) {
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="9" class="py-12 text-center text-xs text-[#6B6B6B]">Nenhum projeto encontrado com os filtros selecionados.</td></tr>`;
        } else {
          tbody.innerHTML = filtered.map(proj => {
            const clientName = proj.client || proj.client_or_brand || 'Institucional';
            const clientTag = renderTag(clientName);
            const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
            const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
            const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;

            // Calcular progresso a partir das tarefas
            const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
            const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
            const totalTasks = projTasks.length;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

            return `
              <tr class="hover:bg-[#FBF9F6] transition-colors cursor-pointer group" onclick="openProjectDetail('${proj.id}')">
                <td class="font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors py-3 px-4">
                  ${proj.name}
                </td>
                <td class="py-3 px-4" onclick="event.stopPropagation()">
                  ${clientTag}
                </td>
                <td class="py-3 px-4">
                  ${getProjectTypeBadge(proj.type)}
                </td>
                <td class="py-3 px-4">
                  ${getProjectStatusBadge(proj.status)}
                </td>
                <td class="py-3 px-4">
                  ${getProjectPriorityBadge(proj.priority)}
                </td>
                <td class="py-3 px-4 font-mono text-xs">
                  ${isProjOverdue 
                    ? `<div class="flex items-center gap-1.5"><span class="text-[#A3281E] font-medium font-mono">${formatDate(proj.deadline)}</span><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span></div>`
                    : `<span class="text-[#1A1A1A]">${proj.deadline ? formatDate(proj.deadline) : '—'}</span>`
                  }
                </td>
                <td class="py-3 px-4 text-xs text-[#1A1A1A]">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-[#E4DDD3] text-[#1A1A1A] flex items-center justify-center font-bold text-[10px]">${manager.substring(0, 2).toUpperCase()}</span>
                    <span>${manager}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="w-32 space-y-1">
                    <div class="flex justify-between text-[10px] text-[#6B6B6B]">
                      <span>${doneTasks}/${totalTasks}</span>
                      <span class="font-medium text-[#1A1A1A]">${pct}%</span>
                    </div>
                    <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                      <div class="h-1.5 rounded-full transition-all duration-300" style="width: ${pct}%; background-color: #6C1C37;"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                  <div class="flex items-center justify-end gap-2">
                    <button onclick="openProjectDetail('${proj.id}')" class="text-xs font-medium text-[#6C1C37] hover:underline">Ver Ficha &rarr;</button>
                    <button onclick="deleteProject('${proj.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1" title="Eliminar">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 2. RENDERIZAR QUADRO KANBAN (5 Colunas por Estado)
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
                  const clientTag = renderTag(clientName);
                  const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
                  const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;
                  const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';

                  const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
                  const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
                  const totalTasks = projTasks.length;
                  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

                  return `
                    <div onclick="openProjectDetail('${proj.id}')"
                      class="crm-card p-4 space-y-3 hover:border-[#6C1C37]/40 hover:shadow-md transition-all cursor-pointer group bg-white">
                      <div class="flex items-center justify-between gap-2">
                        <div onclick="event.stopPropagation()">${clientTag}</div>
                        <div>${getProjectPriorityBadge(proj.priority)}</div>
                      </div>

                      <h4 class="text-xs font-bold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors leading-snug">
                        ${proj.name}
                      </h4>

                      <div class="flex items-center gap-1.5">
                        ${getProjectTypeBadge(proj.type)}
                      </div>

                      <!-- Prazo & Atraso -->
                      <div class="text-[11px] flex items-center justify-between pt-1 border-t border-[#E4DDD3]/60">
                        <span class="text-[#6B6B6B]">Entrega:</span>
                        ${isProjOverdue 
                          ? `<span class="font-bold text-[#A3281E] bg-[#FBEAE8] px-1.5 py-0.5 rounded text-[10px] font-mono border border-[#F5C2BE]">Atrasado (${formatDate(proj.deadline)})</span>`
                          : `<span class="font-mono text-[#1A1A1A]">${proj.deadline ? formatDate(proj.deadline) : '—'}</span>`
                        }
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
                        <span class="text-[#6B6B6B]">${manager}</span>
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

    // ========================================================
    // RENDERIZAÇÃO COMPLETA DE TAREFAS (MÓDULO 2)
    // ========================================================
    function filterTasksByTab(tab) {
      currentTaskTab = tab;
      const tabs = ['all', 'today', 'week', 'overdue', 'my'];
      tabs.forEach(t => {
        const btn = document.getElementById(`tab-tasks-${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer';
          } else {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer';
          }
        }
      });
      renderFullTasks();
    }

    function changeTasksGrouping(mode) {
      currentTaskGrouping = mode;
      renderFullTasks();
    }

    function renderFullTasks() {
      const wrapper = document.getElementById('tasks-content-wrapper');
      if (!wrapper) return;

      const totalBadge = document.getElementById('tasks-total-badge');
      if (totalBadge) totalBadge.innerText = `${localTasks.length} tarefas registadas`;

      // Filtragem
      let filtered = [...localTasks];
      const todayStr = new Date().toISOString().split('T')[0];

      if (currentTaskTab === 'today') {
        filtered = filtered.filter(t => t.due_date === todayStr);
      } else if (currentTaskTab === 'week') {
        filtered = filtered.filter(t => isDueThisWeek(t.due_date));
      } else if (currentTaskTab === 'overdue') {
        filtered = filtered.filter(t => {
          const isDone = t.status === 'concluida' || t.status === 'completed';
          return !isDone && isOverdue(t.due_date);
        });
      } else if (currentTaskTab === 'my') {
        filtered = filtered.filter(t => (t.responsible || t.assignee || t.assignee_name) === 'Tiago Mendes' || (t.responsible || t.assignee || t.assignee_name) === 'Leonor Rodrigues');
      }

      if (filtered.length === 0) {
        wrapper.innerHTML = `
          <div class="crm-card p-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3]">
            <p class="font-semibold text-sm text-[#1A1A1A] mb-1 font-title">Nenhuma tarefa encontrada.</p>
            <p>Não existem tarefas ativas para este filtro de pesquisa.</p>
            <button onclick="openTaskModal()" class="btn-primary py-2 px-4 text-xs font-medium mt-4">
              + Criar Nova Tarefa
            </button>
          </div>
        `;
        return;
      }

      // Função auxiliar para renderizar uma linha de tabela de tarefas
      function renderTaskTableRow(t) {
        const isDone = t.status === 'concluida' || t.status === 'completed';
        const isTaskOverdue = t.due_date && isOverdue(t.due_date) && !isDone;
        const projName = t.project_name || 'Geral';
        const clientName = t.client || t.client_or_brand || (t.project_id ? (localProjects.find(p => p.id === t.project_id)?.client || '—') : '—');
        const respName = t.responsible || t.assignee || t.assignee_name || 'Leonor Rodrigues';

        // Link de jornalista se tipo for contacto
        let journalistCell = '<span class="text-[#6B6B6B]">—</span>';
        if (t.journalist_name || t.journalist_id) {
          const jName = t.journalist_name || 'Jornalista';
          const jId = t.journalist_id || (localJournalists.find(j => j.name === jName)?.id);
          if (jId) {
            journalistCell = `<button onclick="openJournalistDetailDrawer('${jId}')" class="text-xs font-medium text-[#6C1C37] hover:underline flex items-center gap-1">
              <span>${jName}</span>
              <span class="text-[10px] text-[#6B6B6B]">&rarr;</span>
            </button>`;
          } else {
            journalistCell = `<span class="text-xs text-[#1A1A1A]">${jName}</span>`;
          }
        }

        // Link de projeto
        let projCell = `<span class="text-[#6B6B6B]">—</span>`;
        if (projName && projName !== 'Geral') {
          const pObj = localProjects.find(p => p.name === projName || p.id === t.project_id);
          if (pObj) {
            projCell = `<button onclick="openProjectDetail('${pObj.id}')" class="text-xs font-medium text-[#1A1A1A] hover:text-[#6C1C37] hover:underline text-left">
              ${projName}
            </button>`;
          } else {
            projCell = `<span class="text-xs text-[#1A1A1A]">${projName}</span>`;
          }
        }

        return `
          <tr class="hover:bg-[#FBF9F6] transition-colors ${isDone ? 'opacity-60 bg-[#FAFAFA]' : ''}">
            <td class="w-10 text-center py-3 px-3" onclick="event.stopPropagation()">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            </td>
            <td class="py-3 px-4">
              <span class="font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">${t.title}</span>
            </td>
            <td class="py-3 px-4">
              ${getTaskTypeBadge(t.type)}
            </td>
            <td class="py-3 px-4">
              ${projCell}
            </td>
            <td class="py-3 px-4">
              ${clientName !== '—' ? renderTag(clientName) : '<span class="text-[#6B6B6B]">—</span>'}
            </td>
            <td class="py-3 px-4">
              ${journalistCell}
            </td>
            <td class="py-3 px-4 text-xs text-[#1A1A1A]">
              ${respName}
            </td>
            <td class="py-3 px-4 font-mono text-xs">
              ${isTaskOverdue 
                ? `<div class="flex items-center gap-1.5"><span class="text-[#A3281E] font-medium font-mono">${t.due_date} ${t.due_time || ''}</span><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span></div>`
                : `<span class="${isDone ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'}">${t.due_date ? t.due_date : '—'} ${t.due_time || ''}</span>`
              }
            </td>
            <td class="py-3 px-4">
              ${getProjectPriorityBadge(t.priority)}
            </td>
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <button onclick="deleteTask('${t.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] p-1" title="Eliminar Tarefa">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }

      // 1. MODO: SEM AGRUPAMENTO
      if (currentTaskGrouping === 'none') {
        // Ordenar por prazo
        filtered.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));

        wrapper.innerHTML = `
          <div class="crm-card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="crm-table">
                <thead>
                  <tr>
                    <th class="w-10 text-center">Estado</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Jornalista</th>
                    <th>Responsável</th>
                    <th>Prazo</th>
                    <th>Prioridade</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
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
          const pName = t.project_name || 'Sem Projeto / Geral';
          if (!groups[pName]) groups[pName] = [];
          groups[pName].push(t);
        });

        wrapper.innerHTML = Object.keys(groups).map(pName => {
          const groupTasks = groups[pName];
          groupTasks.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
          const pObj = localProjects.find(p => p.name === pName);
          const done = groupTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;

          return `
            <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-2">
              <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">${pName}</h3>
                  ${pObj?.client ? renderTag(pObj.client) : ''}
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-[#6B6B6B]">${done} de ${groupTasks.length} concluídas</span>
                  ${pObj ? `<button onclick="openProjectDetail('${pObj.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline">Abrir Projeto &rarr;</button>` : ''}
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="crm-table">
                  <thead>
                    <tr>
                      <th class="w-10 text-center">Estado</th>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Projeto</th>
                      <th>Cliente</th>
                      <th>Jornalista</th>
                      <th>Responsável</th>
                      <th>Prazo</th>
                      <th>Prioridade</th>
                      <th class="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
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
        const overdue = filtered.filter(t => isOverdue(t.due_date) && t.status !== 'concluida' && t.status !== 'completed');
        const today = filtered.filter(t => t.due_date === todayStr);
        const thisWeek = filtered.filter(t => isDueThisWeek(t.due_date) && t.due_date !== todayStr && !isOverdue(t.due_date));
        const future = filtered.filter(t => !isOverdue(t.due_date) && t.due_date !== todayStr && !isDueThisWeek(t.due_date));

        const sections = [
          { title: 'Em Atraso', tasks: overdue, color: 'text-[#A3281E]', badgeBg: 'bg-[#FBEAE8] text-[#A3281E]' },
          { title: 'Para Hoje', tasks: today, color: 'text-[#6C1C37]', badgeBg: 'bg-[#F4EAE6] text-[#6C1C37]' },
          { title: 'Esta Semana', tasks: thisWeek, color: 'text-[#1A1A1A]', badgeBg: 'bg-[#F6F2EC] text-[#1A1A1A]' },
          { title: 'Próximas Semanas & Sem Prazo', tasks: future, color: 'text-[#6B6B6B]', badgeBg: 'bg-[#F6F2EC] text-[#6B6B6B]' }
        ];

        wrapper.innerHTML = sections.filter(s => s.tasks.length > 0).map(s => `
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-2">
            <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold ${s.color} font-title">${s.title}</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${s.badgeBg}">${s.tasks.length}</span>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="crm-table">
                <thead>
                  <tr>
                    <th class="w-10 text-center">Estado</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Jornalista</th>
                    <th>Responsável</th>
                    <th>Prazo</th>
                    <th>Prioridade</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.tasks.map(renderTaskTableRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('');
      }
    }

    // ========================================================
    // FICHA DETALHADA DO PROJETO (view-project-detail)
    // ========================================================
    function switchProjectDetailTab(tab) {
      activeProjectDetailTab = tab;
      const tabs = ['overview', 'tasks', 'journalists'];
      tabs.forEach(t => {
        const btn = document.getElementById(`proj-tab-btn-${t}`);
        const content = document.getElementById(`proj-tab-content-${t}`);
        if (btn && content) {
          if (t === tab) {
            btn.className = 'px-4 py-2 rounded-xl font-medium bg-[#6C1C37] text-white transition-all cursor-pointer';
            content.classList.remove('hidden');
          } else {
            btn.className = 'px-4 py-2 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer flex items-center gap-1.5';
            content.classList.add('hidden');
          }
        }
      });
    }

    function renderProjectDetail() {
      const proj = localProjects.find(p => p.id === activeProjectId) || localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;

      const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
      const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;

      // Topo & Breadcrumb
      document.getElementById('proj-detail-breadcrumb-title').innerText = proj.name;
      document.getElementById('proj-detail-title').innerText = proj.name;
      
      const clientName = proj.client || proj.client_or_brand || 'Institucional';
      document.getElementById('proj-detail-client-badge').innerText = clientName;
      document.getElementById('proj-detail-type-badge').innerHTML = getProjectTypeBadge(proj.type);
      document.getElementById('proj-detail-status-badge').innerHTML = getProjectStatusBadge(proj.status);
      document.getElementById('proj-detail-priority-badge').innerHTML = getProjectPriorityBadge(proj.priority);

      const overdueAlert = document.getElementById('proj-detail-overdue-alert');
      if (overdueAlert) {
        if (isProjOverdue) overdueAlert.classList.remove('hidden');
        else overdueAlert.classList.add('hidden');
      }

      // Progresso calculado pelas tarefas deste projeto
      const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
      const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
      const totalTasks = projTasks.length;
      const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

      document.getElementById('proj-detail-tasks-progress-label').innerText = `${doneTasks} de ${totalTasks} tarefas concluídas`;
      document.getElementById('proj-detail-tasks-pct-label').innerText = `${pct}%`;
      document.getElementById('proj-detail-progress-bar').style.width = `${pct}%`;

      // Atualizar contadores das abas
      document.getElementById('proj-detail-tab-tasks-badge').innerText = totalTasks;
      
      const targetJourIds = proj.target_journalist_ids || [];
      document.getElementById('proj-detail-tab-journalists-badge').innerText = targetJourIds.length;

      // 1. SEPARADOR RESUMO
      const typeSelect = document.getElementById('proj-detail-type-select');
      if (typeSelect) typeSelect.value = proj.type || 'campanha';
      const statusSelect = document.getElementById('proj-detail-status-select');
      if (statusSelect) statusSelect.value = proj.status || 'em_curso';
      const prioritySelect = document.getElementById('proj-detail-priority-select');
      if (prioritySelect) prioritySelect.value = proj.priority || 'alta';
      const managerSelect = document.getElementById('proj-detail-manager-select');
      if (managerSelect) managerSelect.value = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
      const startDateInput = document.getElementById('proj-detail-start-date');
      if (startDateInput) startDateInput.value = proj.start_date || '2026-10-01';
      const deadlineInput = document.getElementById('proj-detail-deadline-date');
      if (deadlineInput) deadlineInput.value = proj.deadline || '2026-11-28';

      // Equipa Alocada
      const teamContainer = document.getElementById('proj-detail-team-badges');
      if (teamContainer) {
        const team = proj.team || proj.team_members || ['Leonor Rodrigues', 'Tiago Mendes'];
        teamContainer.innerHTML = team.map(m => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] text-xs font-medium border border-[#E4DDD3]">
            <span class="w-4 h-4 rounded-full bg-[#6C1C37] text-white flex items-center justify-center text-[9px] font-bold">${m.substring(0, 2).toUpperCase()}</span>
            <span>${m}</span>
          </span>
        `).join('');
      }

      // Objetivo
      const objEl = document.getElementById('proj-detail-objective');
      if (objEl) objEl.innerText = proj.objective || proj.description || 'Sem objetivo estratégico registado.';

      // Meios-Alvo (Automático a partir dos jornalistas-alvo, só leitura)
      const outletsContainer = document.getElementById('proj-detail-target-outlets-list');
      if (outletsContainer) {
        const targetJourObjs = localJournalists.filter(j => targetJourIds.includes(j.id) || (proj.target_journalists && proj.target_journalists.includes(j.name)));
        const derivedOutlets = new Set();
        targetJourObjs.forEach(j => {
          if (j.outlet_name) derivedOutlets.add(j.outlet_name);
          if (j.outlet_names) j.outlet_names.forEach(o => derivedOutlets.add(o));
        });
        if (proj.target_outlets) proj.target_outlets.forEach(o => derivedOutlets.add(o));

        const outletsArr = [...derivedOutlets];
        if (outletsArr.length === 0) {
          outletsContainer.innerHTML = '<span class="text-xs text-[#6B6B6B]">Nenhum órgão de comunicação identificado automaticamente.</span>';
        } else {
          outletsContainer.innerHTML = outletsArr.map(oName => {
            const ocsObj = localOutlets.find(item => item.name === oName);
            if (ocsObj) {
              return `
                <button type="button" onclick="openOutletDetailDrawer('${ocsObj.id}')"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3] text-xs text-[#1A1A1A] hover:border-[#6C1C37] hover:shadow-xs transition-all cursor-pointer">
                  <span class="w-4 h-4 rounded bg-[#E4DDD3] flex items-center justify-center font-bold text-[9px]">${oName.substring(0, 2).toUpperCase()}</span>
                  <span class="font-medium">${oName}</span>
                  <span class="text-[10px] text-[#6C1C37]">&rarr;</span>
                </button>
              `;
            }
            return `<span class="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#F6F2EC] text-xs font-medium text-[#1A1A1A] border border-[#E4DDD3]">${oName}</span>`;
          }).join('');
        }
      }

      // Links & Documentos
      const linksContainer = document.getElementById('proj-detail-links-list');
      if (linksContainer) {
        const links = proj.links_documents || proj.documents || [
          { label: 'Briefing Executivo do Projeto', url: '#', type: 'briefing' }
        ];
        linksContainer.innerHTML = links.map(doc => {
          const title = doc.label || doc.title || 'Documento';
          const url = doc.url || '#';
          return `
            <a href="${url}" target="_blank" class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/50 hover:bg-white transition-all flex items-center justify-between group">
              <div class="space-y-0.5 truncate mr-2">
                <span class="font-medium text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${title}</span>
                <span class="text-[10px] text-[#6B6B6B] uppercase font-mono">${doc.type || 'Link'}</span>
              </div>
              <svg class="w-4 h-4 text-[#6B6B6B] group-hover:text-[#6C1C37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          `;
        }).join('');
      }

      // Notas
      const notesEl = document.getElementById('proj-detail-notes');
      if (notesEl) notesEl.innerText = proj.notes || 'Sem notas internas registadas.';

      // 2. SEPARADOR TAREFAS DESTE PROJETO
      const tasksTbody = document.getElementById('proj-detail-tasks-tbody');
      if (tasksTbody) {
        if (projTasks.length === 0) {
          tasksTbody.innerHTML = `<tr><td colspan="8" class="py-12 text-center text-xs text-[#6B6B6B]">Nenhuma tarefa associada a este projeto. Clica em "+ Nova Tarefa" acima para adicionar.</td></tr>`;
        } else {
          tasksTbody.innerHTML = projTasks.map(t => {
            const isDone = t.status === 'concluida' || t.status === 'completed';
            const isTaskOverdue = t.due_date && isOverdue(t.due_date) && !isDone;
            const resp = t.responsible || t.assignee || 'Leonor Rodrigues';
            const jourName = t.journalist_name || '—';

            return `
              <tr class="hover:bg-[#FBF9F6] transition-colors ${isDone ? 'opacity-60 bg-[#FAFAFA]' : ''}">
                <td class="w-10 text-center py-3 px-3" onclick="event.stopPropagation()">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                    class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
                </td>
                <td class="py-3 px-4 font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">
                  ${t.title}
                </td>
                <td class="py-3 px-4">
                  ${getTaskTypeBadge(t.type)}
                </td>
                <td class="py-3 px-4 text-xs">
                  ${t.journalist_id ? `<button onclick="openJournalistDetailDrawer('${t.journalist_id}')" class="text-[#6C1C37] hover:underline">${jourName}</button>` : jourName}
                </td>
                <td class="py-3 px-4 text-xs text-[#1A1A1A]">
                  ${resp}
                </td>
                <td class="py-3 px-4 font-mono text-xs">
                  ${isTaskOverdue 
                    ? `<span class="text-[#A3281E] font-medium">${t.due_date} (Em atraso)</span>` 
                    : (t.due_date || '—')}
                </td>
                <td class="py-3 px-4">
                  ${getProjectPriorityBadge(t.priority)}
                </td>
                <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                  <button onclick="deleteTask('${t.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1">Eliminar</button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 3. SEPARADOR JORNALISTAS-ALVO
      const jourGrid = document.getElementById('proj-detail-journalists-grid');
      if (jourGrid) {
        const targetJourObjs = localJournalists.filter(j => targetJourIds.includes(j.id) || (proj.target_journalists && proj.target_journalists.includes(j.name)));
        if (targetJourObjs.length === 0) {
          jourGrid.innerHTML = `
            <div class="col-span-full py-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3] p-8">
              Nenhum jornalista-alvo associado a este projeto.
            </div>
          `;
        } else {
          jourGrid.innerHTML = targetJourObjs.map(j => {
            const outletName = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral';
            const ocs = localOutlets.find(o => o.name === outletName);

            return `
              <div class="crm-card p-4 space-y-3 bg-white">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ${j.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-[#1A1A1A]">${j.name}</h4>
                      <p class="text-[11px] text-[#6B6B6B]">${j.role || 'Jornalista'}</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-[#E4DDD3]/60 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Órgão (OCS):</span>
                    ${ocs ? `
                      <button onclick="openOutletDetailDrawer('${ocs.id}')" class="font-medium text-[#6C1C37] hover:underline flex items-center gap-1">
                        <span>${ocs.name}</span> &nearr;
                      </button>
                    ` : `<span class="font-medium text-[#1A1A1A]">${outletName}</span>`}
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Último contacto:</span>
                    <span class="font-mono text-[#1A1A1A]">${formatRelativeDays(j.last_contact_date)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Editoria:</span>
                    <span class="text-[#1A1A1A]">${(j.intervention_areas && j.intervention_areas[0]) || 'Geral'}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between">
                  <button onclick="openJournalistDetailDrawer('${j.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline">Ver Ficha &rarr;</button>
                  <button onclick="openTaskModalForJournalist('${j.id}')" class="btn-secondary py-1 px-2.5 text-xs">Agendar Contacto</button>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }

    // Ações inline da ficha de projeto
    function saveProjectTitleInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.name = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectTypeInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.type = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStatusInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.status = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectPriorityInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.priority = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectManagerInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.responsible = val;
      proj.manager = val;
      proj.manager_name = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStartDateInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.start_date = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectDeadlineInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.deadline = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectObjectiveInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.objective = e.target.innerText.trim();
      proj.description = proj.objective;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectNotesInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.notes = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }

    function openNewTaskForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openTaskModal(proj ? proj.id : null);
    }

    function openNewContactForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openContactModalPrefilled('', '', proj ? proj.name : '');
    }

    function openTaskModalForJournalist(journalistId) {
      openTaskModal(null, journalistId);
    }

    // ========================================================
    // REGRAS DE LIGAÇÃO & CONCLUSÃO DE TAREFAS (REGRAS 1, 4)
    // ========================================================
    async function toggleTaskStatus(id) {
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const wasCompleted = task.status === 'concluida' || task.status === 'completed';
      const newStatus = wasCompleted ? 'por_fazer' : 'concluida';
      task.status = newStatus;
      
      const todayStr = new Date().toISOString().split('T')[0];

      if (!wasCompleted) {
        task.completed_at = new Date().toISOString();

        // REGRA 1: Ao concluir uma tarefa do tipo "contacto com jornalista",
        // atualiza automaticamente o campo "Último contacto" desse jornalista com a data de conclusão,
        // e conta para o indicador "Contactos hoje" do Painel.
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
            localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
          }
        }
      } else {
        task.completed_at = null;
      }

      // REGRA 4: O progresso do projeto atualiza-se sempre que uma tarefa muda de estado.
      if (task.project_id || task.project_name) {
        const proj = localProjects.find(p => (task.project_id && p.id === task.project_id) || (task.project_name && p.name === task.project_name));
        if (proj) {
          const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
          const doneCount = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
          proj.progress = projTasks.length > 0 ? Math.round((doneCount / projTasks.length) * 100) : 0;
          proj.updated_at = new Date().toISOString();
          localStorage.setItem('rep_projects', JSON.stringify(localProjects));
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

    // ========================================================
    // SUBMISSÃO DE MODAIS: NOVA TAREFA & NOVO PROJETO
    // ========================================================
    function handleTaskTypeChange(type) {
      const jWrapper = document.getElementById('task-journalist-field-wrapper');
      const jSelect = document.getElementById('task-journalist-select');
      if (type === 'contacto_jornalista') {
        jWrapper?.classList.remove('hidden');
        if (jSelect) jSelect.required = true;
      } else {
        jWrapper?.classList.add('hidden');
        if (jSelect) {
          jSelect.required = false;
          jSelect.value = '';
        }
      }
    }

    async function handleNewTaskSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('task-title').value.trim();
      const projSelect = document.getElementById('task-project-select');
      const project_id = projSelect ? projSelect.value : '';
      let project_name = 'Geral';
      let client = 'Geral';

      if (project_id) {
        const pObj = localProjects.find(p => p.id === project_id);
        if (pObj) {
          project_name = pObj.name;
          client = pObj.client || pObj.client_or_brand || 'Geral';
        }
      }

      const type = document.getElementById('task-type-select').value;
      const jSelect = document.getElementById('task-journalist-select');
      const journalist_id = jSelect ? jSelect.value : '';
      let journalist_name = '';
      if (journalist_id) {
        const jObj = localJournalists.find(j => j.id === journalist_id);
        if (jObj) journalist_name = jObj.name;
      }

      const responsible = document.getElementById('task-responsible-select').value;
      const priority = document.getElementById('task-priority-select').value;
      const due_date = document.getElementById('task-duedate').value;
      const due_time = document.getElementById('task-duetime').value;
      const status = document.getElementById('task-status-select').value;
      const notes = document.getElementById('task-notes').value.trim();

      const newTask = {
        id: 'task-' + Date.now(),
        title,
        project_id,
        project_name,
        client,
        client_or_brand: client,
        type,
        journalist_id,
        journalist_name,
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
          const jour = localJournalists.find(j => j.id === journalist_id);
          if (jour) jour.last_contact_date = new Date().toISOString().split('T')[0];
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
        const pObj = localProjects.find(p => p.id === project_id);
        if (pObj) {
          const projTasks = localTasks.filter(t => t.project_id === project_id);
          const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
          pObj.progress = Math.round((done / projTasks.length) * 100);
        }
      }

      syncLocalStorage();
      closeTaskModal();
      renderAll();
      showToast('Tarefa registada com sucesso.');
      e.target.reset();
    }

    async function handleNewProjectSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('project-name').value.trim();
      const client = document.getElementById('project-client').value.trim() || 'Institucional';
      const type = document.getElementById('project-type').value;
      const status = document.getElementById('project-status').value;
      const priority = document.getElementById('project-priority').value;
      const start_date = document.getElementById('project-start-date').value;
      const deadline = document.getElementById('project-deadline').value;
      const responsible = document.getElementById('project-responsible').value;

      // Equipa selecionada
      const teamCheckboxes = document.querySelectorAll('input[name="proj-team-member"]:checked');
      const team = Array.from(teamCheckboxes).map(cb => cb.value);
      if (!team.includes(responsible)) team.unshift(responsible);

      const objective = document.getElementById('project-objective').value.trim();

      // Jornalistas-alvo selecionados
      const jourCheckboxes = document.querySelectorAll('input[name="proj-target-jour"]:checked');
      const target_journalist_ids = Array.from(jourCheckboxes).map(cb => cb.value);
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

      const notes = document.getElementById('project-notes').value.trim();

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
        notes,
        progress: 0,
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
      e.target.reset();
    }

    // Abertura e fecho de modais com pré-preenchimento
    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      // Preencher seletor de projetos
      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          localProjects.map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand})</option>`).join('');
      }

      // Preencher seletor de jornalistas
      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista da Base 2...</option>' +
          localJournalists.map(j => {
            const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '';
            return `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${outlet})</option>`;
          }).join('');
      }

      if (prefilledJourId) {
        const typeSelect = document.getElementById('task-type-select');
        if (typeSelect) typeSelect.value = 'contacto_jornalista';
        handleTaskTypeChange('contacto_jornalista');
      } else {
        handleTaskTypeChange(document.getElementById('task-type-select')?.value || 'contacto_jornalista');
      }

      // Data de entrega por defeito: hoje
      const dueInput = document.getElementById('task-duedate');
      if (dueInput && !dueInput.value) {
        dueInput.value = new Date().toISOString().split('T')[0];
      }

      document.getElementById('modal-new-task').classList.remove('hidden');
      document.getElementById('modal-new-task').classList.add('flex');
    }

    function closeTaskModal() {
      document.getElementById('modal-new-task').classList.add('hidden');
      document.getElementById('modal-new-task').classList.remove('flex');
    }

    function openProjectModal() {
      if (!currentUserPermissions()?.canCreateProjects) {
        showToast('Acesso Restrito: A criação de projetos é reservada à Direção de RP.');
        return;
      }

      // Preencher datalist de clientes
      const clientsDatalist = document.getElementById('project-clients-datalist');
      if (clientsDatalist) {
        const existingClients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
        clientsDatalist.innerHTML = existingClients.map(c => `<option value="${c}"></option>`).join('');
      }

      // Preencher checkboxes de jornalistas-alvo
      const jourContainer = document.getElementById('project-target-journalists-checkboxes');
      if (jourContainer) {
        jourContainer.innerHTML = localJournalists.map(j => {
          const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '';
          return `
            <label class="flex items-center justify-between p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs transition-colors">
              <span class="flex items-center gap-2">
                <input type="checkbox" name="proj-target-jour" value="${j.id}" class="rounded text-[#6C1C37] focus:ring-[#6C1C37]">
                <span class="font-medium text-[#1A1A1A]">${j.name}</span>
                <span class="text-[11px] text-[#6B6B6B]">(${outlet})</span>
              </span>
              <span class="text-[10px] text-[#6B6B6B]">${(j.intervention_areas && j.intervention_areas[0]) || 'Geral'}</span>
            </label>
          `;
        }).join('');
      }

      const today = new Date();
      document.getElementById('project-start-date').value = today.toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      document.getElementById('project-deadline').value = nextMonth.toISOString().split('T')[0];

      document.getElementById('modal-new-project').classList.remove('hidden');
      document.getElementById('modal-new-project').classList.add('flex');
    }

    function closeProjectModal() {
      document.getElementById('modal-new-project').classList.add('hidden');
      document.getElementById('modal-new-project').classList.remove('flex');
    }
