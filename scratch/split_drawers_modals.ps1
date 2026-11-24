$content = Get-Content -Raw -Path 'scratch/drawers_and_modals.html'

# Split drawers and modals
$drawersPart = [regex]::Match($content, '([\s\S]*?)<!-- ===+\s*-->\s*<!-- MODAL: NOVO JORNALISTA').Groups[1].Value
$modalsPart = [regex]::Match($content, '(<!-- ===+\s*-->\s*<!-- MODAL: NOVO JORNALISTA[\s\S]*)$').Groups[1].Value

Set-Content -Path 'scratch/drawers_only.html' -Value $drawersPart
Set-Content -Path 'scratch/modals_only.html' -Value $modalsPart

Write-Output ("Drawers length: " + $drawersPart.Length + ", Modals length: " + $modalsPart.Length)
