$lines = [System.IO.File]::ReadAllLines("src/lib/mock-data.ts", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^export const sampleTasks:|^export const sampleJournalists|^export const sampleOutlets') {
        Write-Output "Line $($i+1): $($lines[$i])"
    }
}
