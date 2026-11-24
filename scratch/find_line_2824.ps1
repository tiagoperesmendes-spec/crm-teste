$lines = [System.IO.File]::ReadAllLines("scratch/check_inline.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 2815-2835 ---"
for ($i = 2814; $i -lt [Math]::Min(2835, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
