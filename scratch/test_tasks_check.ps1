$dash = [System.IO.File]::ReadAllText('c:\Users\tiago\Desktop\crm-teste\dashboard.html', [System.Text.Encoding]::UTF8)
$index = [System.IO.File]::ReadAllText('c:\Users\tiago\Desktop\crm-teste\index.html', [System.Text.Encoding]::UTF8)

Write-Host "dashboard.html checks:"
Write-Host "  Contains task-due-date:" $dash.Contains("task-due-date")
Write-Host "  Contains task-duedate in openTaskModal:" $dash.Contains("task-duedate")
Write-Host "  Contains rep_tasks_v8:" $dash.Contains("rep_tasks_v8")
Write-Host "  Contains tasks.length > 0 check:" $dash.Contains("tasks && tasks.length > 0")

Write-Host "index.html checks:"
Write-Host "  Contains task-due-date:" $index.Contains("task-due-date")
Write-Host "  Contains task-duedate in openTaskModal:" $index.Contains("task-duedate")
Write-Host "  Contains rep_tasks_v8:" $index.Contains("rep_tasks_v8")
Write-Host "  Contains tasks.length > 0 check:" $index.Contains("tasks && tasks.length > 0")
