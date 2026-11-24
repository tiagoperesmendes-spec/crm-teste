$lines = [System.IO.File]::ReadAllLines("src/lib/mock-data.ts", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 1-35 of mock-data.ts ---"
for ($i = 0; $i -lt 35; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
