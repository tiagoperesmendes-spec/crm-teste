$html = Get-Content 'scratch\dom_dump.html'
Write-Output "DOM lines: $($html.Count)"
$authContainer = $html | Select-String -SimpleMatch 'id="auth-container"'
$appContainer = $html | Select-String -SimpleMatch 'id="app-container"'
Write-Output "authContainer: $authContainer"
Write-Output "appContainer: $appContainer"
