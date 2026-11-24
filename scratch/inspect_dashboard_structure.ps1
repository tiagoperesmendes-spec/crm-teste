$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)
Write-Output "dashboard.html line count: $($lines.Length)"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id="view-projects"|id="view-tasks"|id="view-project-detail"|id="modal-new-project"|id="modal-new-task"|function renderProjects|function renderTasks|function renderDashboard|localProjects|localTasks|sampleProjects|sampleTasks') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
    }
}
