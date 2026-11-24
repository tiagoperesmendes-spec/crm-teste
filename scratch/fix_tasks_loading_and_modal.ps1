# Script to fix tasks loading and tasks modal button

$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Fix openTaskModal: fix task-due-date -> task-duedate
$oldOpenTaskModal = @'
    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          localProjects.map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand})</option>`).join('');
      }

      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista...</option>' +
          localJournalists.map(j => `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'})</option>`).join('');
      }

      const today = new Date();
      document.getElementById('task-due-date').value = today.toISOString().split('T')[0];

      document.getElementById('modal-new-task').classList.remove('hidden');
      document.getElementById('modal-new-task').classList.add('flex');
    }
'@

$newOpenTaskModal = @'
    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      // Resetar formulário
      const form = document.querySelector('#modal-new-task form');
      if (form) form.reset();

      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          localProjects.map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand})</option>`).join('');
      }

      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista...</option>' +
          localJournalists.map(j => `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'})</option>`).join('');
      }

      const typeSelect = document.getElementById('task-type-select');
      if (typeSelect) {
        if (prefilledJourId) {
          typeSelect.value = 'contacto_jornalista';
        }
        handleTaskTypeChange(typeSelect.value);
      }

      const respSelect = document.getElementById('task-responsible-select');
      if (respSelect) {
        const user = currentUser;
        const defaultResp = user?.user_metadata?.full_name || user?.name || 'Tiago Mendes';
        respSelect.value = defaultResp;
      }

      const today = new Date();
      const dueDateInput = document.getElementById('task-duedate') || document.getElementById('task-due-date');
      if (dueDateInput) dueDateInput.value = today.toISOString().split('T')[0];

      const modal = document.getElementById('modal-new-task');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }
'@

$oldOpen_norm = $oldOpenTaskModal -replace "`r`n", "`n"
$newOpen_norm = $newOpenTaskModal -replace "`r`n", "`n"
$html_norm = $html -replace "`r`n", "`n"

if ($html_norm.Contains($oldOpen_norm)) {
    $html = $html_norm.Replace($oldOpen_norm, $newOpen_norm)
    Write-Host "Fixed: openTaskModal element ID and form initialization."
} else {
    Write-Warning "oldOpenTaskModal pattern not found directly"
}

# 2. Fix loadInitialData Supabase tasks fetch overwriting with empty array
$oldTasksFetch = @'
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          }
        } catch (e) { }
'@

$newTasksFetch = @'
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks && tasks.length > 0) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          } else if (!localTasks || localTasks.length === 0) {
            localTasks = [...DEFAULT_SAMPLE_TASKS];
            localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
          }
        } catch (e) { }
'@

$oldTasks_norm = $oldTasksFetch -replace "`r`n", "`n"
$newTasks_norm = $newTasksFetch -replace "`r`n", "`n"
$html_norm = $html -replace "`r`n", "`n"

if ($html_norm.Contains($oldTasks_norm)) {
    $html = $html_norm.Replace($oldTasks_norm, $newTasks_norm)
    Write-Host "Fixed: loadInitialData checks tasks.length > 0 before overwriting."
} else {
    Write-Warning "oldTasksFetch pattern not found"
}

# 3. Fix loadFromLocalStorageFallback to restore tasks if empty or bump key to rep_tasks_v8
$oldTasksFallback = @'
      if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_projects_v7') !== 'true') {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
        localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      }
'@

$newTasksFallback = @'
      if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_tasks_v8') !== 'true') {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
        localStorage.setItem('rep_tasks_v8', 'true');
        localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      }
'@

$oldFallback_norm = $oldTasksFallback -replace "`r`n", "`n"
$newFallback_norm = $newTasksFallback -replace "`r`n", "`n"
$html_norm = $html -replace "`r`n", "`n"

if ($html_norm.Contains($oldFallback_norm)) {
    $html = $html_norm.Replace($oldFallback_norm, $newFallback_norm)
    Write-Host "Fixed: loadFromLocalStorageFallback bumped to rep_tasks_v8."
} else {
    # If key was different, let's replace by regex
    $html = [regex]::Replace($html, "if \(!localTasks \|\| localTasks\.length === 0 \|\| localStorage\.getItem\('[^']+'\) !== 'true'\) \{\s*localTasks = \[\.\.\.DEFAULT_SAMPLE_TASKS\];\s*localStorage\.setItem\('rep_tasks', JSON\.stringify\(localTasks\)\);\s*\}", $newTasksFallback)
    Write-Host "Replaced tasks fallback via regex."
}

# 4. At start of renderFullTasks, ensure localTasks fallback
$oldRenderTasksStart = "function renderFullTasks() {`n      const wrapper = document.getElementById('tasks-content-wrapper');"
$newRenderTasksStart = "function renderFullTasks() {`n      if (!localTasks || localTasks.length === 0) {`n        localTasks = [...DEFAULT_SAMPLE_TASKS];`n        try { localStorage.setItem('rep_tasks', JSON.stringify(localTasks)); } catch(e){}`n      }`n      const wrapper = document.getElementById('tasks-content-wrapper');"

$html_norm = $html -replace "`r`n", "`n"
if ($html_norm.Contains($oldRenderTasksStart)) {
    $html = $html_norm.Replace($oldRenderTasksStart, $newRenderTasksStart)
    Write-Host "Fixed: renderFullTasks automatically restores DEFAULT_SAMPLE_TASKS if empty."
} else {
    Write-Warning "oldRenderTasksStart pattern not found"
}

# Save to both dashboard.html and index.html
[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Both dashboard.html and index.html successfully updated for tasks!"
