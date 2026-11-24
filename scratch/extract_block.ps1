$lines = Get-Content "c:\Users\tiago\Desktop\crm-teste\scratch\check_inline.html"
$selected = $lines[6310..6660]
[System.IO.File]::WriteAllLines("c:\Users\tiago\Desktop\crm-teste\scratch\extracted_proj_detail_block.js", $selected, [System.Text.Encoding]::UTF8)
Write-Host "Extracted $(($selected).Count) lines."
