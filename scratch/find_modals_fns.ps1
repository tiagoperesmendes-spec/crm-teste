$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function openProjectModal|function openTaskModal|function closeProjectModal|function closeTaskModal') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
    }
}
