$content = [System.IO.File]::ReadAllText("$pwd/scratch/test_fixed.html", [System.Text.Encoding]::UTF8)
$idx = $content.IndexOf('function loadFromLocalStorageFallback')
Write-Output $content.Substring($idx, 1200)
