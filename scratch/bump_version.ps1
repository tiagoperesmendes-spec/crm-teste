$path = "$pwd/scratch/test_fixed.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$updated = $content.Replace("localStorage.getItem('rep_bases_v2')", "localStorage.getItem('rep_bases_v4')")
$updated = $updated.Replace("localStorage.setItem('rep_bases_v2'", "localStorage.setItem('rep_bases_v4'")
$updated = $updated.Replace("localStorage.getItem('rep_outlets_v2')", "localStorage.getItem('rep_outlets_v4')")
$updated = $updated.Replace("localStorage.setItem('rep_outlets_v2'", "localStorage.setItem('rep_outlets_v4'")

[System.IO.File]::WriteAllText($path, $updated, [System.Text.Encoding]::UTF8)
Write-Output "Bumped version flag to v4 successfully."
