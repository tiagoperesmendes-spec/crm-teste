$content = [System.IO.File]::ReadAllText("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
Write-Output $content.Substring(240500, 1100)
