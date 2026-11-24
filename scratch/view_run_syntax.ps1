$content = [System.IO.File]::ReadAllText("scratch/run_syntax.bat", [System.Text.Encoding]::UTF8)
Write-Output $content
