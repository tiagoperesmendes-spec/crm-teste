$content = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_drawer_direct_out.txt", [System.Text.Encoding]::UTF8)
$pattern = '(?s)<div id="TEST_DRAWER_RESULT"[^>]*>(.*?)</div>'
if ($content -match $pattern) {
    Write-Host "FOUND RESULT DIV:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Div not found in output" -ForegroundColor Yellow
}
