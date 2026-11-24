$path = "C:\Users\tiago\.gemini\antigravity\brain\9c50b896-cc68-4995-a14f-953e0e0ce190\relatorio-auditoria-arquitetura-crm.md"
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$pattern = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]'
$matches = [regex]::Matches($text, $pattern)
Write-Output "Emoji matches in artifact: $($matches.Count)"
