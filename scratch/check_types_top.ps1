$types = [System.IO.File]::ReadAllText("$pwd/src/types/pr-crm.ts", [System.Text.Encoding]::UTF8)
Write-Output $types.Substring(0, 1600)
