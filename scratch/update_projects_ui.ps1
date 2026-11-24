# Script to update projects UI and modal in dashboard.html and index.html

$dashboardPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

# Verify files exist
if (!(Test-Path $dashboardPath)) { throw "dashboard.html not found" }
if (!(Test-Path $indexPath)) { throw "index.html not found" }

Write-Host "Both files found. Ready for update."
