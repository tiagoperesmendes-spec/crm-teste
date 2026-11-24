$filePath = "scratch/test_updated_dashboard.html"
$content = [System.IO.File]::ReadAllLines($filePath, [System.Text.Encoding]::UTF8)

# Find updateDashboardGreeting and updateKpis
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match 'function updateDashboardGreeting\(\) \{') {
        $greetStart = $i
    }
    if ($content[$i] -match 'function updateKpis\(\) \{') {
        $kpiStart = $i
    }
}

Write-Output "greetStart: $greetStart, kpiStart: $kpiStart"
