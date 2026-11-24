$content = [System.IO.File]::ReadAllText("scratch/check_script_syntax.html", [System.Text.Encoding]::UTF8)
Write-Output $content
