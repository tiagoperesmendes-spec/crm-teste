$p1 = [System.IO.File]::ReadAllText("scratch\data_definitions.js", [System.Text.Encoding]::UTF8)
$p2 = [System.IO.File]::ReadAllText("scratch\interactive_functions.js", [System.Text.Encoding]::UTF8)
$p3 = [System.IO.File]::ReadAllText("scratch\jour_func.js", [System.Text.Encoding]::UTF8)

$replacementText = $p1 + "`r`n`r`n" + $p2 + "`r`n`r`n" + $p3

$indexLines = [System.IO.File]::ReadAllLines("index.html", [System.Text.Encoding]::UTF8)

$startIndex = -1
$endIndex = -1

for ($i = 0; $i -lt $indexLines.Length; $i++) {
    if ($indexLines[$i].Trim().StartsWith("const DEFAULT_SAMPLE_TASKS = [") -and $startIndex -eq -1) {
        $startIndex = $i
    }
    if ($startIndex -ge 0 -and $indexLines[$i].Trim().StartsWith("function renderOutletsTable()") -and $endIndex -eq -1) {
        $endIndex = $i
        break
    }
}

if ($startIndex -ge 0 -and $endIndex -ge 0) {
    Write-Output "Found replacement region: from line $($startIndex + 1) to $($endIndex)"
    
    $beforeLines = $indexLines[0..($startIndex - 1)]
    $afterLines = $indexLines[$endIndex..($indexLines.Length - 1)]
    
    $combined = ($beforeLines -join "`r`n") + "`r`n" + $replacementText + "`r`n`r`n" + ($afterLines -join "`r`n")
    
    [System.IO.File]::WriteAllText("index.html", $combined, [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::WriteAllText("dashboard.html", $combined, [System.Text.UTF8Encoding]::new($false))
    
    Write-Output "Successfully updated index.html and dashboard.html!"
} else {
    Write-Error "Could not find start ($startIndex) or end ($endIndex) markers!"
}
