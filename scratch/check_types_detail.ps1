$types = [System.IO.File]::ReadAllText("$pwd/src/types/pr-crm.ts", [System.Text.Encoding]::UTF8)
$taskIdx = $types.IndexOf('export type TaskPriority')
Write-Output $types.Substring($taskIdx, [Math]::Min(1200, $types.Length - $taskIdx))
