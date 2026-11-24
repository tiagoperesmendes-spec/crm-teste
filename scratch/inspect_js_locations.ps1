$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function renderFullTasks\(|function renderFullProjects\(|function renderProjectDetail\(|function openNewTaskForCurrentProject\(|function handleNewTaskSubmit\(|function handleNewProjectSubmit\(|function toggleTaskStatus\(|function openTaskModal\(|function openProjectModal\(') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
    }
}
