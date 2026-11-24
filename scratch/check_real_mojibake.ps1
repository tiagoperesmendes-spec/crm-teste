$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

$realMojibake = @('Ã¡', 'Ã©', 'Ã­', 'Ã³', 'Ãº', 'Ã£', 'Ãµ', 'Ã¢', 'Ãª', 'Ã´', 'Ã§', 'â€¢', 'a†•', 'â†', 'Ã€', 'Ã‰')

$foundCount = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    foreach ($p in $realMojibake) {
        if ($line.Contains($p)) {
            Write-Output "Line $($i+1): found $p in: $($line.Trim())"
            $foundCount++
            break
        }
    }
}

Write-Output "Real mojibake count: $foundCount"
