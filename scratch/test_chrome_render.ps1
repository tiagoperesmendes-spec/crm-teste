$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

Write-Host "Chrome found at: $chromePath"

# Run chrome headless with --dump-dom and check exit code
$dashUrl = "file:///c:/Users/tiago/Desktop/crm-teste/dashboard.html"
$proc = Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--dump-dom", "--disable-gpu", $dashUrl -NoNewWindow -PassThru -RedirectStandardOutput "c:\Users\tiago\Desktop\crm-teste\scratch\chrome_dom_test.txt"
$proc.WaitForExit(10000)

Write-Host "Exit Code: $($proc.ExitCode)"
$dom = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\chrome_dom_test.txt", [System.Text.Encoding]::UTF8)
Write-Host "DOM Dump length: $($dom.Length)"
Write-Host "Has form-login: $($dom.Contains('id=""form-login""'))"
Write-Host "Has quickFillAccount: $($dom.Contains('quickFillAccount'))"
