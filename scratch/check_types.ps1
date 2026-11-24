$types = [System.IO.File]::ReadAllText("$pwd/src/types/pr-crm.ts", [System.Text.Encoding]::UTF8)
$hasProj = $types.IndexOf('export interface Project')
$hasTask = $types.IndexOf('export interface Task')
Write-Output ("Project index: " + $hasProj)
Write-Output ("Task index: " + $hasTask)

if ($hasProj -ge 0) {
    Write-Output "--- PROJECT TYPE ---"
    Write-Output $types.Substring($hasProj, [Math]::Min(800, $types.Length - $hasProj))
}

if ($hasTask -ge 0) {
    Write-Output "--- TASK TYPE ---"
    Write-Output $types.Substring($hasTask, [Math]::Min(800, $types.Length - $hasTask))
}
