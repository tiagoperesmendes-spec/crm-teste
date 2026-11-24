$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'initSupabase|supabaseClient\.from\(''tasks''|supabaseClient\.from\(''projects''') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
    }
}
