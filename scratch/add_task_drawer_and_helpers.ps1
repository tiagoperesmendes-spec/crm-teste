$files = @("dashboard.html", "index.html")

$helperBlock = @'
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // ==========================================
    // PAINEL DE DETALHE DA TAREFA (DRAWER)
    // ==========================================
    function openTaskDetail(taskId) {
      activeTaskId = taskId;
      const task = (localTasks || []).find(t => t.id === taskId);
      if (!task) return;

      const headerId = document.getElementById('task-detail-header-id');
      if (headerId) headerId.innerText = `#${task.id}`;
      const titleInput = document.getElementById('task-detail-title-input');
      if (titleInput) titleInput.value = task.title || '';
      const statusSel = document.getElementById('task-detail-status-select');
      if (statusSel) statusSel.value = task.status || 'pending';
      const prioSel = document.getElementById('task-detail-priority-select');
      if (prioSel) prioSel.value = task.priority || 'media';
      const dueInput = document.getElementById('task-detail-duedate-input');
      if (dueInput) dueInput.value = task.due_date || '';
      const assigneeSel = document.getElementById('task-detail-assignee-select');
      if (assigneeSel) assigneeSel.value = task.responsible || task.assignee || 'Tiago Mendes';
      const clientInput = document.getElementById('task-detail-client-input');
      if (clientInput) clientInput.value = task.client || task.client_or_brand || '';
      const jourInput = document.getElementById('task-detail-journalist-input');
      if (jourInput) jourInput.value = task.journalist_name || '';
      const notesInput = document.getElementById('task-detail-notes-textarea');
      if (notesInput) notesInput.value = task.notes || '';

      // Popular seletor de projeto
      const projSelect = document.getElementById('task-detail-project-select');
      if (projSelect) {
        projSelect.innerHTML = (localProjects || []).map(p =>
          `<option value="${p.name}" ${task.project_name === p.name ? 'selected' : ''}>${p.name}</option>`
        ).join('') + `<option value="Geral" ${!task.project_name || task.project_name === 'Geral' ? 'selected' : ''}>Geral</option>`;
      }

      // Sub-tarefas
      renderTaskDetailSubtasks(task);

      // Comentários
      renderTaskDetailComments(task);

      // Histórico
      renderTaskDetailActivity(task);

      // Botão de conclusão
      const btnComplete = document.getElementById('btn-toggle-task-complete');
      if (btnComplete) {
        btnComplete.innerText = (task.status === 'completed' || task.status === 'concluida') ? 'Reabrir Tarefa' : 'Marcar como Concluída';
      }

      const panel = document.getElementById('panel-task-detail');
      if (panel) panel.classList.remove('hidden');
    }

    function closeTaskDetail() {
      const panel = document.getElementById('panel-task-detail');
      if (panel) panel.classList.add('hidden');
      renderAll();
    }

    function toggleTaskDetailExpand() {
      const container = document.getElementById('panel-task-detail-container');
      if (!container) return;
      if (container.classList.contains('max-w-2xl')) {
        container.classList.remove('max-w-2xl');
        container.classList.add('max-w-4xl');
      } else {
        container.classList.remove('max-w-4xl');
        container.classList.add('max-w-2xl');
      }
    }

    function saveTaskProperty(property, value) {
      const task = (localTasks || []).find(t => t.id === activeTaskId);
      if (!task) return;

      lastEditedTaskBackup = { ...task };
      task[property] = value;
      syncLocalStorage();
      updateKpis();

      showAutoSaveToast('Alteração guardada.', () => {
        if (lastEditedTaskBackup) {
          Object.assign(task, lastEditedTaskBackup);
          syncLocalStorage();
          openTaskDetail(activeTaskId);
          renderAll();
        }
      });
    }

    function renderTaskDetailSubtasks(task) {
      const list = document.getElementById('task-detail-subtasks-list');
      const countEl = document.getElementById('task-detail-subtasks-count');
      if (!list) return;

      const subtasks = task.subtasks || [];
      const doneCount = subtasks.filter(s => s.done).length;
      if (countEl) countEl.innerText = `${doneCount}/${subtasks.length} concluídas`;

      if (subtasks.length === 0) {
        list.innerHTML = `<p class="text-[11px] text-[#6B6B6B]">Nenhuma sub-tarefa. Adiciona passos de execução abaixo.</p>`;
        return;
      }

      list.innerHTML = subtasks.map(st => `
        <div class="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white transition-all">
          <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
            <input type="checkbox" ${st.done ? 'checked' : ''} onchange="toggleSubtask('${st.id}')"
              class="w-3.5 h-3.5 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            <span class="${st.done ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'} truncate">${st.title}</span>
          </label>
        </div>
      `).join('');
    }

    function toggleSubtask(stId) {
      const task = (localTasks || []).find(t => t.id === activeTaskId);
      if (!task || !task.subtasks) return;
      const st = task.subtasks.find(s => s.id === stId);
      if (st) {
        st.done = !st.done;
        syncLocalStorage();
        renderTaskDetailSubtasks(task);
        showAutoSaveToast('Sub-tarefa atualizada.');
      }
    }

    function handleSubtaskEnter(e) {
      if (e.key === 'Enter') {
        addNewSubtaskFromInput();
      }
    }

    function addNewSubtaskFromInput() {
      const input = document.getElementById('task-detail-new-subtask-input');
      if (!input || !input.value.trim()) return;

      const task = (localTasks || []).find(t => t.id === activeTaskId);
      if (!task) return;
      if (!task.subtasks) task.subtasks = [];

      task.subtasks.push({
        id: 'st-' + Date.now(),
        title: input.value.trim(),
        done: false
      });
      input.value = '';
      syncLocalStorage();
      renderTaskDetailSubtasks(task);
      showAutoSaveToast('Sub-tarefa adicionada.');
    }

    function renderTaskDetailComments(task) {
      const list = document.getElementById('task-detail-comments-list');
      if (!list) return;

      const comments = task.comments || [];
      if (comments.length === 0) {
        list.innerHTML = `<p class="text-[11px] text-[#6B6B6B]">Nenhum comentário registado nesta entrega.</p>`;
        return;
      }

      list.innerHTML = comments.map(c => `
        <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3]/70 space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-medium text-[#1A1A1A]">${c.author} · <span class="text-[#6B6B6B]">${c.role || 'Consultor'}</span></span>
            <span class="text-[#6B6B6B]">${c.time || 'Hoje'}</span>
          </div>
          <p class="text-xs text-[#1A1A1A] leading-relaxed">${c.text}</p>
        </div>
      `).join('');
    }

    function addNewCommentFromInput() {
      const input = document.getElementById('task-detail-new-comment-input');
      if (!input || !input.value.trim()) return;

      const task = (localTasks || []).find(t => t.id === activeTaskId);
      if (!task) return;
      if (!task.comments) task.comments = [];

      const authorName = currentUser?.name || currentUser?.user_metadata?.full_name || 'Leonor Rodrigues';

      task.comments.push({
        author: authorName,
        role: 'Direção de RP',
        text: input.value.trim(),
        time: 'Agora'
      });
      input.value = '';
      syncLocalStorage();
      renderTaskDetailComments(task);
      showAutoSaveToast('Comentário publicado.');
    }

    function renderTaskDetailActivity(task) {
      const list = document.getElementById('task-detail-activity-list');
      if (!list) return;

      const acts = task.activity_log || ['Registo criado no CRM MODO'];
      list.innerHTML = acts.map(a => `<div>• ${a}</div>`).join('');
    }

    function toggleCurrentDetailedTaskComplete() {
      if (activeTaskId) {
        toggleTaskStatus(activeTaskId);
        openTaskDetail(activeTaskId);
      }
    }

    function deleteCurrentDetailedTask() {
      if (activeTaskId) {
        deleteTask(activeTaskId);
        closeTaskDetail();
      }
    }

    function navigateToCurrentTaskProject() {
      const task = (localTasks || []).find(t => t.id === activeTaskId);
      if (!task || !task.project_name) return;
      closeTaskDetail();
      const projObj = (localProjects || []).find(p => p.name === task.project_name);
      if (projObj) {
        openProjectDetail(projObj.id);
      } else {
        switchView('projects');
      }
    }

'@

$targetMarker = '// PESQUISA GLOBAL FUNCIONAL DA DASHBOARD'

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file).Path, [System.Text.Encoding]::UTF8)

    if ($content.Contains($targetMarker) -and -not $content.Contains('function escapeHtml(str)')) {
        $replacement = $helperBlock + "`n    " + $targetMarker
        $content = $content.Replace($targetMarker, $replacement)
        [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Added task drawer & escapeHtml helpers to $file"
    } else {
        Write-Output "Target marker not found or already added in $file"
    }
}
