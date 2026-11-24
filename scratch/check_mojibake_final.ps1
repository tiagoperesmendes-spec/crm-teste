$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

$corruptPatterns = @('Ã¡', 'Ã©', 'Ã­', 'Ã³', 'Ãº', 'Ã£', 'Ãµ', 'Ã¢', 'Ãª', 'Ã´', 'Ã§', 'Ã€', 'Ã‰', 'Ã“', 'Ã‡', 'a†•', 'â€', 'Ã', 'Â')

$foundCount = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    foreach ($p in $corruptPatterns) {
        if ($line.Contains($p)) {
            Write-Output "Line $($i+1): found $p in: $($line.Trim())"
            $foundCount++
            break
        }
    }
}

Write-Output "Total mojibake found: $foundCount"
