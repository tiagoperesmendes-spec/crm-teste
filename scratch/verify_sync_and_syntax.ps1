Write-Output "=== SYNCHRONIZATION CHECK ==="
$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")
$hashes = @{}
foreach ($f in $files) {
    if (Test-Path $f) {
        $hash = (Get-FileHash $f -Algorithm SHA256).Hash
        Write-Output "$f : $hash"
        $hashes[$f] = $hash
    } else {
        Write-Output "$f MISSING"
    }
}

$uniqueHashes = $hashes.Values | Select-Object -Unique
if ($uniqueHashes.Count -eq 1) {
    Write-Output "SUCCESS: All 4 files are 100% byte-for-byte identical!"
} else {
    Write-Output "WARNING: Files differ! Hash count = $($uniqueHashes.Count)"
}

Write-Output ""
Write-Output "=== JAVASCRIPT SYNTAX / BRACKET BALANCE ==="
$content = [System.IO.File]::ReadAllText((Resolve-Path "dashboard.html").Path, [System.Text.Encoding]::UTF8)

# Check script tags
$openScripts = ([regex]::Matches($content, "<script\b")).Count
$closeScripts = ([regex]::Matches($content, "</script>")).Count
Write-Output "Script tags: <script> = $openScripts, </script> = $closeScripts"

# Extract main script block (the large CRM logic script)
$scriptMatches = [regex]::Matches($content, "(?s)<script(?:\s+[^>]*)?>(.*?)</script>")
Write-Output "Total script blocks found: $($scriptMatches.Count)"

$idx = 0
foreach ($m in $scriptMatches) {
    $idx++
    $code = $m.Groups[1].Value
    if ($code.Length -gt 1000) {
        $openCurly = ([regex]::Matches($code, "\{")).Count
        $closeCurly = ([regex]::Matches($code, "\}")).Count
        $openParen = ([regex]::Matches($code, "\(")).Count
        $closeParen = ([regex]::Matches($code, "\)")).Count
        $openSquare = ([regex]::Matches($code, "\[")).Count
        $closeSquare = ([regex]::Matches($code, "\]")).Count

        Write-Output "Script #$idx (length $($code.Length)): Curlys {$openCurly / }$closeCurly, Parens ($openParen / )$closeParen, Brackets [$openSquare / ]$closeSquare"
    }
}
