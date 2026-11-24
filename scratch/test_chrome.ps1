$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///c:/Users/tiago/Desktop/crm-teste/dashboard.html"
$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--disable-gpu", "--dump-dom", "`"$url`"" -NoNewWindow -PassThru -RedirectStandardOutput "scratch/chrome_out.txt" -RedirectStandardError "scratch/chrome_err.txt"
$proc.WaitForExit(10000)
$out = Get-Content "scratch/chrome_out.txt"
Write-Output "Output lines: $($out.Count)"
$out | Select-Object -First 20
