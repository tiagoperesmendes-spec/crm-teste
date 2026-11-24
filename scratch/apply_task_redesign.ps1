$dashboardPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$newTasksView = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\new_tasks_view.html", [System.Text.Encoding]::UTF8)
$newTasksModal = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\new_tasks_modal.html", [System.Text.Encoding]::UTF8)
$newTasksJs = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\tasks_redesign_js.js", [System.Text.Encoding]::UTF8)

$html = [System.IO.File]::ReadAllText($dashboardPath, [System.Text.Encoding]::UTF8)

# 1. Replace #view-tasks HTML
$patternViewTasks = '(?s)<!-- ======================================================== -->\s*<!-- VISTA 2: TAREFAS.*?<!-- ======================================================== -->\s*<!-- VISTA 3: PROJETOS'
if ($html -match $patternViewTasks) {
    Write-Host "Matched view-tasks pattern."
    $replacementView = $newTasksView.Trim() + "`r`n`r`n      <!-- ======================================================== -->`r`n      <!-- VISTA 3: PROJETOS"
    $html = [regex]::Replace($html, $patternViewTasks, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacementView }, 1)
} else {
    Write-Host "ERROR: view-tasks pattern NOT matched!" -ForegroundColor Red
}

# 2. Replace #modal-new-task HTML
$patternModalTask = '(?s)<!-- ======================================================== -->\s*<!-- MODAL: NOVA TAREFA.*?<!-- ======================================================== -->\s*<!-- MODAL: NOVO PROJETO'
if ($html -match $patternModalTask) {
    Write-Host "Matched modal-new-task pattern."
    $replacementModal = $newTasksModal.Trim() + "`r`n`r`n  <!-- ======================================================== -->`r`n  <!-- MODAL: NOVO PROJETO"
    $html = [regex]::Replace($html, $patternModalTask, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacementModal }, 1)
} else {
    Write-Host "ERROR: modal-new-task pattern NOT matched!" -ForegroundColor Red
}

# 3. Replace JS block (filterTasksByTab down to renderFullTasks end before VISTA 3 project detail)
$patternJs = '(?s)// ========================================================\s*// RENDERIZAÇÃO COMPLETA DE TAREFAS \(MÓDULO 2\).*?// ========================================================\s*// FICHA DETALHADA DO PROJETO'
if ($html -match $patternJs) {
    Write-Host "Matched tasks JS pattern."
    $replacementJs = $newTasksJs.Trim() + "`r`n`r`n    // ========================================================`r`n    // FICHA DETALHADA DO PROJETO"
    $html = [regex]::Replace($html, $patternJs, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacementJs }, 1)
} else {
    Write-Host "ERROR: tasks JS pattern NOT matched!" -ForegroundColor Red
}

# 4. Remove old duplicate handleNewTaskSubmit around line 11558
$patternOldSubmit = '(?s)async function handleNewTaskSubmit\(e\) \{.*?e\.target\.reset\(\);\s*\}'
if ($html -match $patternOldSubmit) {
    Write-Host "Matched old handleNewTaskSubmit pattern."
    $html = [regex]::Replace($html, $patternOldSubmit, "// [handleNewTaskSubmit defined in unified tasks module]", 1)
} else {
    Write-Host "WARNING: old handleNewTaskSubmit pattern NOT matched!" -ForegroundColor Yellow
}

# 5. Remove old duplicate openTaskModal and closeTaskModal
$patternOldOpenClose = '(?s)// Abertura e fecho de modais de tarefas\s*function openTaskModal\(.*?function closeTaskModal\(\) \{.*?document\.getElementById\(''modal-new-task''\)\.classList\.remove\(''flex''\);\s*\}'
if ($html -match $patternOldOpenClose) {
    Write-Host "Matched old openTaskModal / closeTaskModal pattern."
    $html = [regex]::Replace($html, $patternOldOpenClose, "// [openTaskModal and closeTaskModal defined in unified tasks module]", 1)
} else {
    Write-Host "WARNING: old openTaskModal / closeTaskModal pattern NOT matched!" -ForegroundColor Yellow
}

# 6. Add closeAllTaskMenus to window click listener if not present
if ($html -notmatch 'closeAllTaskMenus\(\)') {
    $patternClickListener = "if \(!e\.target\.closest\('\.proj-row-menu-btn'\)"
    $replacementClickListener = "if (!e.target.closest('.task-row-menu-btn') && !e.target.closest('.task-row-menu-popover')) { closeAllTaskMenus(); }`r`n        if (!e.target.closest('.proj-row-menu-btn')"
    $html = $html.Replace("if (!e.target.closest('.proj-row-menu-btn')", $replacementClickListener)
    Write-Host "Added closeAllTaskMenus to click listener."
}

# 7. Ensure loadFromLocalStorageFallback preserves existing localTasks
$oldFallbackCheck = "if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_tasks_v8') !== 'true') {"
$newFallbackCheck = "if (!localTasks || localTasks.length === 0) {"
if ($html.Contains($oldFallbackCheck)) {
    $html = $html.Replace($oldFallbackCheck, $newFallbackCheck)
    Write-Host "Fixed loadFromLocalStorageFallback to preserve tasks."
}

# Write to dashboard.html and index.html
[System.IO.File]::WriteAllText($dashboardPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated dashboard.html and index.html!"
