$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")
$items = @(
    @{ Name = "search-journalists"; Pattern = 'id="search-journalists"'; Expected = $true },
    @{ Name = "search-outlets"; Pattern = 'id="search-outlets"'; Expected = $true },
    @{ Name = "Exportar dados (Jornalistas)"; Pattern = 'Exportar dados'; Expected = $true },
    @{ Name = "+ Adicionar Jornalista"; Pattern = '+ Adicionar Jornalista'; Expected = $true },
    @{ Name = "+ Adicionar Meio"; Pattern = '+ Adicionar Meio'; Expected = $true },
    @{ Name = "filter-jour-area"; Pattern = 'id="filter-jour-area"'; Expected = $false },
    @{ Name = "filter-ocs-format"; Pattern = 'id="filter-ocs-format"'; Expected = $false },
    @{ Name = "dropdown-jour-cols"; Pattern = 'id="dropdown-jour-cols"'; Expected = $false },
    @{ Name = "dropdown-outlets-cols"; Pattern = 'id="dropdown-outlets-cols"'; Expected = $false },
    @{ Name = "sort-icon-jour-name"; Pattern = 'id="sort-icon-jour-name"'; Expected = $false },
    @{ Name = "sort-icon-ocs-name"; Pattern = 'id="sort-icon-ocs-name"'; Expected = $false }
)

foreach ($file in $files) {
    Write-Host "=== Testing $file ==="
    $dash = Get-Content -Raw $file -Encoding UTF8
    $allOk = $true
    foreach ($item in $items) {
        $found = $dash.Contains($item.Pattern)
        $ok = ($found -eq $item.Expected)
        if (-not $ok) {
            Write-Host "FAIL: $($item.Name): Found=$found (Expected=$($item.Expected))"
            $allOk = $false
        }
    }
    if ($allOk) {
        Write-Host "SUCCESS: All checks passed for $file"
    }
}
