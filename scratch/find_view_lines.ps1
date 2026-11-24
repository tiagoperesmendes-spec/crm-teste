$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

$vTasks = -1
$vProj = -1
$vJour = -1
$vProjDet = -1
$vAfterProjDet = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id="view-tasks"') { $vTasks = $i }
    if ($lines[$i] -match 'id="view-projects"') { $vProj = $i }
    if ($lines[$i] -match 'id="view-journalists"') { $vJour = $i }
    if ($lines[$i] -match 'id="view-project-detail"') { $vProjDet = $i }
    if ($vProjDet -gt 0 -and $i -gt $vProjDet -and $lines[$i] -match 'id="view-') {
        $vAfterProjDet = $i
        break
    }
}

Write-Output "view-tasks line: $($vTasks+1)"
Write-Output "view-projects line: $($vProj+1)"
Write-Output "view-journalists line: $($vJour+1)"
Write-Output "view-project-detail line: $($vProjDet+1)"
Write-Output "view after project detail line: $($vAfterProjDet+1)"
