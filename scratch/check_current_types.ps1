$content = [System.IO.File]::ReadAllText("$pwd/src/types/pr-crm.ts", [System.Text.Encoding]::UTF8)

# Show Project and Task definitions
$taskStart = $content.IndexOf('export interface Task')
$projStart = $content.IndexOf('export interface Project')
Write-Output "Task at $taskStart, Proj at $projStart"
Write-Output $content.Substring($taskStart, $projStart + 400 - $taskStart)
