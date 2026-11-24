$lines = [System.IO.File]::ReadAllLines("src/lib/mock-data.ts", [System.Text.Encoding]::UTF8)
Write-Output "mock-data.ts line count: $($lines.Length)"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'sampleProjects|sampleTasks') {
        Write-Output "Line $($i+1): $($lines[$i])"
    }
}
