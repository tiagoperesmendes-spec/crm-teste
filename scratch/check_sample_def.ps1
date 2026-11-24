$content = [System.IO.File]::ReadAllText("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)

$taskIdx = $content.IndexOf('const DEFAULT_SAMPLE_TASKS = [')
$projIdx = $content.IndexOf('const DEFAULT_SAMPLE_PROJECTS = [')
$contactsIdx = $content.IndexOf('const DEFAULT_SAMPLE_CONTACTS = [')

Write-Output "Tasks idx: $taskIdx, Proj idx: $projIdx, Contacts idx: $contactsIdx"

Write-Output "--- SAMPLE TASKS FIRST 600 CHARS ---"
Write-Output $content.Substring($taskIdx, 600)

Write-Output "`n--- SAMPLE PROJECTS FIRST 600 CHARS ---"
Write-Output $content.Substring($projIdx, 600)
