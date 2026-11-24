$content = Get-Content -Path 'dashboard.html' -Encoding UTF8 -Raw
Write-Output $content.Substring(240400, 1000)
