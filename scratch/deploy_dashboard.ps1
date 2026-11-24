Copy-Item -Path 'scratch/test_dashboard.html' -Destination 'dashboard.html' -Force
Copy-Item -Path 'scratch/test_dashboard.html' -Destination 'index.html' -Force

$hash1 = (Get-FileHash 'dashboard.html').Hash
$hash2 = (Get-FileHash 'index.html').Hash

Write-Output ("dashboard.html hash: " + $hash1)
Write-Output ("index.html hash:     " + $hash2)
Write-Output ("Hashes match: " + ($hash1 -eq $hash2))
