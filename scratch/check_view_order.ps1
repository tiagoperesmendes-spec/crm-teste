$content = [System.IO.File]::ReadAllText("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)

$taskStart = $content.IndexOf('<div id="view-tasks"')
$projStart = $content.IndexOf('<div id="view-projects"')
$contactsStart = $content.IndexOf('<div id="view-contacts"')
$jourStart = $content.IndexOf('<div id="view-journalists"')
$outletsStart = $content.IndexOf('<div id="view-outlets"')
$projDetailStart = $content.IndexOf('<div id="view-project-detail"')

Write-Output "view-tasks: $taskStart"
Write-Output "view-projects: $projStart"
Write-Output "view-contacts: $contactsStart"
Write-Output "view-journalists: $jourStart"
Write-Output "view-outlets: $outletsStart"
Write-Output "view-project-detail: $projDetailStart"
