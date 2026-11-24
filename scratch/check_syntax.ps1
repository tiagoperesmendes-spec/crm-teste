$html = Get-Content -Raw 'index.html'
$pattern = '(?s)<script\b[^>]*>(.*?)</script>'
$matches = [regex]::Matches($html, $pattern)
Write-Output "Total script tags found: $($matches.Count)"
$idx = 0
foreach ($m in $matches) {
    $idx++
    $code = $m.Groups[1].Value
    if ($code.Trim().Length -gt 0) {
        $testFile = "scratch/test_script_$idx.js"
        [System.IO.File]::WriteAllText($testFile, $code, [System.Text.Encoding]::UTF8)
        $nodeRes = node -c $testFile 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Output "ERROR in script $idx : $nodeRes"
        } else {
            Write-Output "Script $idx OK ($($code.Length) chars)"
        }
    }
}
