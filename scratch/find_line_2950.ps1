$lines = [System.IO.File]::ReadAllLines("scratch/check_inline.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 2940-2960 ---"
for ($i = 2939; $i -lt [Math]::Min(2960, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
