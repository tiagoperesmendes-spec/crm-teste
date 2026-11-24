$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///c:/Users/tiago/Desktop/crm-teste/dashboard.html"
$tmpDir = "c:\Users\tiago\Desktop\crm-teste\scratch\chrome_profile"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$res = & $chrome --headless=new --disable-gpu --user-data-dir="$tmpDir" --dump-dom $url 2>&1
Write-Output "Length: $($res.Length)"
$res | Select-Object -First 20
