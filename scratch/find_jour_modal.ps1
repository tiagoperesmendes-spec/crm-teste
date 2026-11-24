$lines = Get-Content -Path 'dashboard.html' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id="modal-new-journalist"') {
        for ($j = $i; $j -lt [Math]::Min($i + 120, $lines.Length); $j++) {
            if ($lines[$j] -match 'form id="form-new-jour') {
                Write-Output "Form line: $($j+1)"
            }
            if ($lines[$j] -match 'Criar jornalista') {
                for ($k = [Math]::Max(0, $j - 10); $k -le [Math]::Min($lines.Length - 1, $j + 5); $k++) {
                    Write-Output "$($k+1): $($lines[$k])"
                }
                break
            }
        }
        break
    }
}
