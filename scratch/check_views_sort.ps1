$content = [System.IO.File]::ReadAllText("$pwd/scratch/views_markup.html", [System.Text.Encoding]::UTF8)
Write-Output ("Contains ↕: " + $content.Contains([char]8597))
