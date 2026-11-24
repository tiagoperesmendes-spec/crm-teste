$lines = Get-Content -Path 'dashboard.html' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match 'id="view-tasks"' -or 
        $line -match 'id="modal-new-task"' -or 
        $line -match 'function renderFullTasks' -or 
        $line -match 'function handleNewTaskSubmit' -or
        $line -match 'function openTaskModal' -or
        $line -match 'function filterTasksByTab') {
        Write-Output "$($i + 1): $line"
    }
}
