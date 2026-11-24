$lines = [System.IO.File]::ReadAllLines("index.html", [System.Text.Encoding]::UTF8)

# Find lines where "let activeProjectId = 'sample-proj-1';" occurs
$indices = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].Trim() -eq "let activeProjectId = 'sample-proj-1';") {
        $indices += $i
    }
}

Write-Output "Found activeProjectId at line indices: $($indices -join ', ')"

if ($indices.Count -gt 1) {
    # Keep only the last one!
    # For each earlier one, remove the block: from "    // ==========================================" right above it, down to the end of getOffsetDateString "    }"
    # Let's inspect the lines around each index
    $removeLines = [System.Collections.Generic.HashSet[int]]::new()
    for ($k = 0; $k -lt ($indices.Count - 1); $k++) {
        $idx = $indices[$k]
        # go backwards to find "// =========================================="
        $start = $idx
        while ($start -gt 0 -and -not $lines[$start].Trim().StartsWith("// ====")) {
            $start--
        }
        if ($start -gt 0 -and $lines[$start - 1].Trim().StartsWith("//")) {
            $start--
        }
        # go forwards to find the closing "}" of getOffsetDateString
        $end = $idx
        while ($end -lt $lines.Length -and -not ($lines[$end].Trim() -eq "}")) {
            $end++
        }
        Write-Output "Removing duplicate block from line $($start + 1) to $($end + 1)"
        for ($l = $start; $l -le $end; $l++) {
            $null = $removeLines.Add($l)
        }
    }

    $newLines = @()
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if (-not $removeLines.Contains($i)) {
            $newLines += $lines[$i]
        }
    }

    [System.IO.File]::WriteAllLines("index.html", $newLines, [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::WriteAllLines("dashboard.html", $newLines, [System.Text.UTF8Encoding]::new($false))
    Write-Output "Successfully updated index.html and dashboard.html! New line count: $($newLines.Length)"
}
