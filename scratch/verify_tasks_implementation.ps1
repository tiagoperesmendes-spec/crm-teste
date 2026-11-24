$dashboard = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)
$index = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\index.html", [System.Text.Encoding]::UTF8)

$tests = @()

function Assert-Check($name, $condition) {
    if ($condition) {
        Write-Host "[PASS] $name" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[FAIL] $name" -ForegroundColor Red
        return $false
    }
}

Write-Host "--- 1. ESTRUTURA HTML DA VISTA DE TAREFAS (#view-tasks) ---"
Assert-Check "ID view-tasks existe" ($dashboard -match 'id="view-tasks"')
Assert-Check "Título 'Tarefas' no cabeçalho" ($dashboard -match '<h1[^>]*>Tarefas<\/h1>')
Assert-Check "Resumo dinâmico #tasks-summary-text" ($dashboard -match 'id="tasks-summary-text"')
Assert-Check "Botão '+ Nova tarefa' com ID view-tasks-add-btn" ($dashboard -match 'id="view-tasks-add-btn"')
Assert-Check "Separadores com contagens (all, today, week, overdue, my)" (
    $dashboard -match 'id="task-tab-all"' -and
    $dashboard -match 'id="task-tab-today"' -and
    $dashboard -match 'id="task-tab-week"' -and
    $dashboard -match 'id="task-tab-overdue"' -and
    $dashboard -match 'id="task-tab-my"' -and
    $dashboard -match 'id="task-tab-count-all"'
)
Assert-Check "Barra de filtros numa só linha (pesquisa, tipo, prioridade, responsável, agrupamento)" (
    $dashboard -match 'id="tasks-search-input"' -and
    $dashboard -match 'id="tasks-filter-type"' -and
    $dashboard -match 'id="tasks-filter-priority"' -and
    $dashboard -match 'id="tasks-filter-responsible"' -and
    $dashboard -match 'id="tasks-grouping-select"'
)
Assert-Check "Content wrapper #tasks-content-wrapper e footer #tasks-table-footer" (
    $dashboard -match 'id="tasks-content-wrapper"' -and
    $dashboard -match 'id="tasks-table-footer"'
)

Write-Host "`n--- 2. ESTRUTURA DO MODAL NOVA TAREFA (#modal-new-task) ---"
Assert-Check "ID modal-new-task existe" ($dashboard -match 'id="modal-new-task"')
Assert-Check "Título 'Nova tarefa'" ($dashboard -match '<h2[^>]*>Nova tarefa<\/h2>')
Assert-Check "Subtítulo 'Só precisas de 3 campos para começar'" ($dashboard -match 'Só precisas de 3 campos para começar')
Assert-Check "Campo Título da tarefa *" ($dashboard -match 'id="task-title"')
Assert-Check "Chips segmentados para Tipo de tarefa" ($dashboard -match 'id="task-type-buttons-container"')
Assert-Check "Campo condicional de jornalista #task-journalist-field-wrapper" ($dashboard -match 'id="task-journalist-field-wrapper"')
Assert-Check "Campo Prazo (Data) *" ($dashboard -match 'id="task-duedate"')
Assert-Check "Campo Responsável e Projeto" ($dashboard -match 'id="task-responsible-select"' -and $dashboard -match 'id="task-project-select"')
Assert-Check "Botões segmentados para Prioridade" ($dashboard -match 'id="new-task-priority-segmented"')
Assert-Check "Secção recolhível 'Mais detalhes (opcional)'" ($dashboard -match 'id="task-details-content"' -and $dashboard -match 'id="task-details-chevron"')
Assert-Check "Rodapé com indicador 'Falta: ...' #task-modal-missing-msg" ($dashboard -match 'id="task-modal-missing-msg"')
Assert-Check "Botão 'Criar tarefa' com ID btn-submit-new-task desativado por defeito" ($dashboard -match 'id="btn-submit-new-task"\s+disabled')

Write-Host "`n--- 3. FUNÇÕES JAVASCRIPT ---"
Assert-Check "getTaskTypeBadge definida" ($dashboard -match 'function getTaskTypeBadge\(')
Assert-Check "getTaskDueInfo definida" ($dashboard -match 'function getTaskDueInfo\(')
Assert-Check "setTasksStatusTab e filterTasksByTab definidas" ($dashboard -match 'function setTasksStatusTab\(' -and $dashboard -match 'function filterTasksByTab\(')
Assert-Check "onTasksFilterChange definida" ($dashboard -match 'function onTasksFilterChange\(')
Assert-Check "changeTasksGrouping definida" ($dashboard -match 'function changeTasksGrouping\(')
Assert-Check "clearTasksFilters definida" ($dashboard -match 'function clearTasksFilters\(')
Assert-Check "setNewTaskType e setNewTaskPriority definidas" ($dashboard -match 'function setNewTaskType\(' -and $dashboard -match 'function setNewTaskPriority\(')
Assert-Check "toggleTaskDetailsSection definida" ($dashboard -match 'function toggleTaskDetailsSection\(')
Assert-Check "checkNewTaskFormValidity definida" ($dashboard -match 'function checkNewTaskFormValidity\(')
Assert-Check "openTaskModal e openEditTaskModal definidas" ($dashboard -match 'function openTaskModal\(' -and $dashboard -match 'function openEditTaskModal\(')
Assert-Check "closeTaskModal definida" ($dashboard -match 'function closeTaskModal\(')
Assert-Check "handleNewTaskSubmit definida" ($dashboard -match 'function handleNewTaskSubmit\(')
Assert-Check "toggleTaskStatus definida" ($dashboard -match 'function toggleTaskStatus\(')
Assert-Check "closeAllTaskMenus e toggleTaskRowMenu definidas" ($dashboard -match 'function closeAllTaskMenus\(' -and $dashboard -match 'function toggleTaskRowMenu\(')
Assert-Check "renderFullTasks definida" ($dashboard -match 'function renderFullTasks\(')

Write-Host "`n--- 4. INTEGRAÇÃO E SINCRONIZAÇÃO ---"
Assert-Check "dashboard.html e index.html com o mesmo hash" ((Get-FileHash "dashboard.html").Hash -eq (Get-FileHash "index.html").Hash)
