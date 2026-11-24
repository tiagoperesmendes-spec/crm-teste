$content = [System.IO.File]::ReadAllText("$pwd/scratch/crm_bases_logic.js", [System.Text.Encoding]::UTF8)
$idx = $content.IndexOf('function sortJournalists')
Write-Output $content.Substring($idx, 500)
