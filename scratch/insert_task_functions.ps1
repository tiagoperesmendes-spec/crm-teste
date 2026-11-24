$dashboardPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"
$missingJs = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\missing_task_functions.js", [System.Text.Encoding]::UTF8)

$marker = "    // [handleNewTaskSubmit defined in unified tasks module]"

$dashContent = [System.IO.File]::ReadAllText($dashboardPath, [System.Text.Encoding]::UTF8)
if ($dashContent.Contains($marker)) {
    $dashContent = $dashContent.Replace($marker, $missingJs.Trim())
    [System.IO.File]::WriteAllText($dashboardPath, $dashContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated dashboard.html successfully."
} else {
    Write-Host "ERROR: Marker not found in dashboard.html!" -ForegroundColor Red
}

$indexContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
if ($indexContent.Contains($marker)) {
    $indexContent = $indexContent.Replace($marker, $missingJs.Trim())
    [System.IO.File]::WriteAllText($indexPath, $indexContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated index.html successfully."
} else {
    Write-Host "ERROR: Marker not found in index.html!" -ForegroundColor Red
}
