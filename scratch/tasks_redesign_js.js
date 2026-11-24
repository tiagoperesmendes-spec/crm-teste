    // ========================================================
    // MÓDULO DE TAREFAS REDESENHADO (GESTÃO DE TAREFAS & NOVA TAREFA)
    // ========================================================

    let editingTaskId = null;
    let currentTaskTab = 'all';
    let currentTaskGrouping = 'none';

    function getTaskTypeBadge(type) {
      const t = (type || '').toLowerCase();
      if (t === 'contacto_jornalista' || t === 'contacto com jornalista' || t === 'contacto') {
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
          <svg class="w-3 h-3 text-[#6C1C37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span>Contacto</span>
        </span>`;
      }
      if (t === 'redacao' || t === 'redação') {
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
          <svg class="w-3 h-3 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span>Redação</span>
        </span>`;
      }
      if (t === 'reuniao' || t === 'reunião') {
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
          <svg class="w-3 h-3 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span>Reunião</span>
        </span>`;
      }
      if (t === 'aprovacao_cliente' || t === 'aprovacao' || t === 'aprovação do cliente' || t === 'aprovação') {
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
          <svg class="w-3 h-3 text-[#3F5A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Aprovação</span>
        </span>`;
      }
      return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
        <svg class="w-3 h-3 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        <span>Outra</span>
      </span>`;
    }

    function getTaskDueInfo(dateStr, isDone) {
      if (!dateStr) {
        return { formatted: '—', relative: '', isOverdue: false, textClass: 'text-[#6B6B6B]' };
      }
      const parts = dateStr.split('-');
      let d;
      if (parts.length === 3) {
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        d = new Date(dateStr);
      }
      if (isNaN(d.getTime())) {
        return { formatted: dateStr, relative: '', isOverdue: false, textClass: 'text-[#6B6B6B]' };
      }
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const formatted = `${d.getDate()} ${months[d.getMonth()]}`;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffMs = target.getTime() - today.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        if (isDone) {
          return {
            formatted,
            relative: 'concluída',
            isOverdue: false,
            textClass: 'text-[#6B6B6B]'
          };
        }
        return {
          formatted,
          relative: overdueDays === 1 ? 'atrasado 1 dia' : `atrasado ${overdueDays} dias`,
          isOverdue: true,
          textClass: 'text-[#A3281E] font-medium'
        };
      } else if (diffDays === 0) {
        return {
          formatted,
          relative: 'hoje',
          isOverdue: false,
          textClass: isDone ? 'text-[#6B6B6B]' : 'text-[#6C1C37] font-medium'
        };
      } else if (diffDays === 1) {
        return {
          formatted,
          relative: 'amanhã',
          isOverdue: false,
          textClass: isDone ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'
        };
      } else {
        return {
          formatted,
          relative: `em ${diffDays} dias`,
          isOverdue: false,
          textClass: isDone ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'
        };
      }
    }

    function setTasksStatusTab(tab) {
      currentTaskTab = tab;
      const tabs = ['all', 'today', 'week', 'overdue', 'my'];
      tabs.forEach(t => {
        const btn = document.getElementById(`task-tab-${t}`);
        const badge = document.getElementById(`task-tab-count-${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = 'task-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0';
            if (badge) badge.className = 'px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white';
          } else {
            btn.className = 'task-status-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0';
            if (badge) badge.className = 'text-[11px] font-normal text-[#8A8A8A]';
          }
        }
      });
      renderFullTasks();
    }

    function filterTasksByTab(tab) {
      setTasksStatusTab(tab);
    }

    function onTasksFilterChange() {
      renderFullTasks();
    }

    function changeTasksGrouping(mode) {
      currentTaskGrouping = mode;
      renderFullTasks();
    }

    function clearTasksFilters() {
      currentTaskTab = 'all';
      const q = document.getElementById('tasks-search-input');
      if (q) q.value = '';
      const t = document.getElementById('tasks-filter-type');
      if (t) t.value = 'all';
      const p = document.getElementById('tasks-filter-priority');
      if (p) p.value = 'all';
      const r = document.getElementById('tasks-filter-responsible');
      if (r) r.value = 'all';
      const g = document.getElementById('tasks-grouping-select');
      if (g) g.value = 'none';
      currentTaskGrouping = 'none';
      setTasksStatusTab('all');
    }

    function setNewTaskType(type) {
      const hidden = document.getElementById('task-type-select');
      if (hidden) hidden.value = type;

      const types = ['contacto_jornalista', 'redacao', 'reuniao', 'aprovacao_cliente', 'outra'];
      types.forEach(t => {
        const btn = document.getElementById(`btn-task-type-${t}`);
        if (btn) {
          if (t === type) {
            btn.className = 'task-type-btn py-2 px-3 text-xs font-semibold rounded-xl border border-[#6C1C37] bg-[#6C1C37] text-white shadow-xs transition-all cursor-pointer text-center';
          } else {
            btn.className = 'task-type-btn py-2 px-3 text-xs font-medium rounded-xl border border-[#E4DDD3] bg-white text-[#1A1A1A] hover:bg-[#FBF9F6] transition-all cursor-pointer text-center';
          }
        }
      });

      const jourWrapper = document.getElementById('task-journalist-field-wrapper');
      if (jourWrapper) {
        if (type === 'contacto_jornalista') {
          jourWrapper.classList.remove('hidden');
        } else {
          jourWrapper.classList.add('hidden');
        }
      }

      checkNewTaskFormValidity();
    }

    function setNewTaskPriority(prio) {
      const hidden = document.getElementById('task-priority-select');
      if (hidden) hidden.value = prio;

      const prios = ['alta', 'media', 'baixa'];
      prios.forEach(p => {
        const btn = document.getElementById(`btn-task-prio-${p}`);
        if (btn) {
          if (p === prio) {
            btn.className = 'flex-1 py-2 rounded-lg font-semibold text-center transition-all bg-white text-[#1A1A1A] shadow-xs cursor-pointer';
          } else {
            btn.className = 'flex-1 py-2 rounded-lg font-medium text-center transition-all text-[#6B6B6B] hover:text-[#1A1A1A] cursor-pointer';
          }
        }
      });
    }

    function toggleTaskDetailsSection() {
      const content = document.getElementById('task-details-content');
      const chevron = document.getElementById('task-details-chevron');
      if (!content) return;
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    }

    function checkNewTaskFormValidity() {
      const titleInput = document.getElementById('task-title');
      const dateInput = document.getElementById('task-duedate');
      const typeInput = document.getElementById('task-type-select');
      const jourSelect = document.getElementById('task-journalist-select');
      const missingMsg = document.getElementById('task-modal-missing-msg');
      const submitBtn = document.getElementById('btn-submit-new-task');

      const title = titleInput ? titleInput.value.trim() : '';
      const date = dateInput ? dateInput.value : '';
      const type = typeInput ? typeInput.value : 'contacto_jornalista';
      const jour = jourSelect ? jourSelect.value : '';

      const missing = [];
      if (!title) missing.push('título da tarefa');
      if (!date) missing.push('prazo');
      if (type === 'contacto_jornalista' && !jour) missing.push('selecionar jornalista');

      if (missing.length > 0) {
        if (missingMsg) {
          missingMsg.innerHTML = `<span class="text-[#8A8A8A]">Falta: ${missing.join(' e ')}</span>`;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('opacity-40', 'cursor-not-allowed');
        }
        return false;
      } else {
        if (missingMsg) {
          missingMsg.innerHTML = `<span class="text-[#3F5A2E] font-medium flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-[#3F5A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Pronto para guardar</span>`;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        }
        return true;
      }
    }

    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      editingTaskId = null;
      const form = document.getElementById('form-new-task');
      if (form) form.reset();

      // Repor título do modal
      const titleEl = document.querySelector('#modal-new-task h2');
      if (titleEl) titleEl.innerText = 'Nova tarefa';
      const subtitleEl = document.querySelector('#modal-new-task p');
      if (subtitleEl) subtitleEl.innerText = 'Só precisas de 3 campos para começar. O resto podes preencher depois.';
      const submitBtn = document.getElementById('btn-submit-new-task');
      if (submitBtn) submitBtn.innerText = 'Criar tarefa';

      // Preencher Projetos
      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          (localProjects || []).map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand || 'Geral'})</option>`).join('');
      }

      // Preencher Jornalistas
      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista...</option>' +
          (localJournalists || []).map(j => `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'})</option>`).join('');
      }

      // Preencher Responsável por defeito
      const respSelect = document.getElementById('task-responsible-select');
      if (respSelect) {
        const user = currentUser;
        const defaultResp = user?.user_metadata?.full_name || user?.name || 'Tiago Mendes';
        respSelect.value = defaultResp;
      }

      // Preencher Prazo por defeito (Hoje)
      const today = new Date();
      const dueDateInput = document.getElementById('task-duedate');
      if (dueDateInput) dueDateInput.value = today.toISOString().split('T')[0];

      // Hora limite por defeito
      const dueTimeInput = document.getElementById('task-duetime');
      if (dueTimeInput) dueTimeInput.value = '18:00';

      // Tipo por defeito
      if (prefilledJourId) {
        setNewTaskType('contacto_jornalista');
      } else {
        setNewTaskType('contacto_jornalista');
      }

      // Prioridade por defeito
      setNewTaskPriority('media');

      // Fechar detalhes recolhíveis por defeito
      const detailsContent = document.getElementById('task-details-content');
      const detailsChevron = document.getElementById('task-details-chevron');
      if (detailsContent) detailsContent.classList.add('hidden');
      if (detailsChevron) detailsChevron.style.transform = 'rotate(0deg)';

      checkNewTaskFormValidity();

      const modal = document.getElementById('modal-new-task');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function openEditTaskModal(id) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      editingTaskId = task.id;

      // Preencher selects primeiro
      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          (localProjects || []).map(p => `<option value="${p.id}" ${p.id === task.project_id ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand || 'Geral'})</option>`).join('');
      }

      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista...</option>' +
          (localJournalists || []).map(j => `<option value="${j.id}" ${j.id === task.journalist_id ? 'selected' : ''}>${j.name} (${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'})</option>`).join('');
      }

      // Título e Subtítulo
      const titleEl = document.querySelector('#modal-new-task h2');
      if (titleEl) titleEl.innerText = 'Editar tarefa';
      const subtitleEl = document.querySelector('#modal-new-task p');
      if (subtitleEl) subtitleEl.innerText = 'Atualiza os detalhes desta entrega ou contacto.';
      const submitBtn = document.getElementById('btn-submit-new-task');
      if (submitBtn) submitBtn.innerText = 'Guardar alterações';

      // Preencher campos
      const titleInput = document.getElementById('task-title');
      if (titleInput) titleInput.value = task.title || '';

      setNewTaskType(task.type || 'contacto_jornalista');
      if (jourSelect && task.journalist_id) jourSelect.value = task.journalist_id;

      const dateInput = document.getElementById('task-duedate');
      if (dateInput) dateInput.value = task.due_date || '';

      const respSelect = document.getElementById('task-responsible-select');
      if (respSelect && task.responsible) respSelect.value = task.responsible;

      setNewTaskPriority(task.priority || 'media');

      const timeInput = document.getElementById('task-duetime');
      if (timeInput) timeInput.value = task.due_time || '18:00';

      const statusSelect = document.getElementById('task-status-select');
      if (statusSelect) statusSelect.value = task.status || 'por_fazer';

      const notesInput = document.getElementById('task-notes');
      if (notesInput) notesInput.value = task.notes || '';

      checkNewTaskFormValidity();

      const modal = document.getElementById('modal-new-task');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function closeTaskModal() {
      const modal = document.getElementById('modal-new-task');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      editingTaskId = null;
    }

    async function handleNewTaskSubmit(e) {
      e.preventDefault();

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
              if (jour) jour.last_contact_date = new Date().toISOString().split('T')[0];
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
          const pObj = (localProjects || []).find(p => p.id === project_id);
          if (pObj) {
            const projTasks = localTasks.filter(t => t.project_id === project_id);
            const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
            pObj.progress = Math.round((done / projTasks.length) * 100);
          }
        }

        syncLocalStorage();
        closeTaskModal();

        // Limpar filtros e alternar para a aba 'Todas' para que a nova tarefa apareça de imediato no topo
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

    function toggleTaskRowMenu(id, e) {
      e.stopPropagation();
      const menu = document.getElementById(`task-menu-${id}`);
      const isHidden = menu ? menu.classList.contains('hidden') : true;
      closeAllTaskMenus();
      if (menu && isHidden) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.left = `${Math.min(rect.right - 176, window.innerWidth - 186)}px`;
        menu.classList.remove('hidden');
      }
    }

    function closeAllTaskMenus() {
      document.querySelectorAll('.task-row-menu-popover').forEach(el => el.classList.add('hidden'));
    }

    function renderFullTasks() {
      if (!localTasks || localTasks.length === 0) {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
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
