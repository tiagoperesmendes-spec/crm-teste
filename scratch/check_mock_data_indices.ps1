$content = [System.IO.File]::ReadAllText("$pwd/src/lib/mock-data.ts", [System.Text.Encoding]::UTF8)

$taskIdx = $content.IndexOf('export const sampleTasks: Task[] = [')
$projIdx = $content.IndexOf('export const sampleProjects: Project[] = [')
$contactsIdx = $content.IndexOf('export const sampleDailyContacts: DailyContact[] = [')

Write-Output "taskIdx: $taskIdx, projIdx: $projIdx, contactsIdx: $contactsIdx"
