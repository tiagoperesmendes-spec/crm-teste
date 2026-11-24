$content = [System.IO.File]::ReadAllText("$pwd/scratch/crm_bases_logic.js", [System.Text.Encoding]::UTF8)
Write-Output $content.Substring(0, 1200)
