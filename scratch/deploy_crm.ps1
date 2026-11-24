$src = "scratch/test_updated_dashboard.html"
$dst1 = "dashboard.html"
$dst2 = "index.html"

[System.IO.File]::Copy($src, $dst1, $true)
[System.IO.File]::Copy($src, $dst2, $true)

$hash1 = (Get-FileHash -Path $dst1 -Algorithm MD5).Hash
$hash2 = (Get-FileHash -Path $dst2 -Algorithm MD5).Hash

Write-Output "dashboard.html hash: $hash1"
Write-Output "index.html hash:     $hash2"
Write-Output "Hashes match: $($hash1 -eq $hash2)"
